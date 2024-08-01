import S3 from "aws-sdk/clients/s3"
import FormData from "form-data"
import fetch from "node-fetch"
import { z } from "zod"

import { env } from "@/env.mjs"
import { AUDIO_TYPE } from "@/config/audio-type"
import { verifyUserHasAccessToInterview } from "@/lib/access"
import { db } from "@/lib/db"
import { openai } from "@/lib/openai"
import { feedbackPrompt, whisperPrompt } from "@/lib/prompt"
import { getCurrentUser } from "@/lib/session"
import {
  feedbackRequestPromptSchema,
  feedbackResponsePromptSchema,
} from "@/lib/validations/prompt"

const routeContextSchema = z.object({
  params: z.object({
    interviewId: z.string(),
  }),
})

export const revalidate = 0

export const maxDuration = 300

export async function POST(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const sessionUser = await getCurrentUser()

    if (!sessionUser) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { params } = routeContextSchema.parse(context)

    if (
      !(await verifyUserHasAccessToInterview(
        sessionUser.id,
        params.interviewId
      ))
    ) {
      return new Response(null, { status: 403 })
    }

    const questions = await db.question.findMany({
      where: {
        interview: {
          userId: sessionUser.id,
          id: params.interviewId,
        },
        answerAudio: {
          not: null,
        },
      },
    })

    const interview = await db.interview.findUnique({
      where: {
        id: params.interviewId,
      },
    })

    if (!interview) return new Response(null, { status: 404 })

    console.info("Generating feedback for interview:", interview.id)

    const user = await db.user.findUnique({
      where: {
        id: sessionUser.id,
      },
      select: {
        resume: true,
        email: true,
      },
    })

    if (!user) throw new Error("User not found")
    if (!user.email) throw new Error("User does not have an email")
    if (!user.resume) throw new Error("User does not have a resume")

    try {
      console.info("Transcribing answers")
      const mappedQuestions = await Promise.all(
        questions.map(async (question) => {
          if (!question.answerAudio) {
            throw new Error("Question does not have an answer")
          }

          let transcribedAnswer = question.transcribedAnswer
          if (!transcribedAnswer) {
            transcribedAnswer = await getAnswerTranscription(
              question.answerAudio,
              question.id
            )
          }

          return {
            questionId: question.id,
            question: question.question,
            answer: transcribedAnswer,
          }
        })
      )
      console.info("Transcribed answers")

      const promptRequest: z.infer<typeof feedbackRequestPromptSchema> = {
        resume: user.resume,
        questionsAnswers: mappedQuestions,
        position: interview.position,
        description: interview.description || undefined,
      }

      const parsedPromptRequest =
        feedbackRequestPromptSchema.parse(promptRequest)

      console.info("Sending feedback prompt to openai")

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: feedbackPrompt,
          },
          {
            role: "user",
            content: JSON.stringify(parsedPromptRequest),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      })

      console.info("Generated feedback")

      const message = response.choices[0].message?.content

      if (!message)
        throw new Error(
          "OpenAI did not return a message for the feedback prompt"
        )

      let messageObject = {}

      try {
        messageObject = JSON.parse(message)
      } catch (error) {
        throw new Error(
          "OpenAI did not return a valid JSON message for the feedback prompt for the interview " +
            interview.id +
            ": " +
            response,
          {
            cause: response,
          }
        )
      }

      console.info("Parsed Feedback", messageObject)

      const parsedMessage = feedbackResponsePromptSchema.parse(messageObject)

      console.info("Validated Message")

      await db.interview.update({
        where: {
          id: interview.id,
        },
        data: {
          feedback: parsedMessage.feedback,
          questions: {
            update: parsedMessage.questionsFeedback.map((questionFeedback) => ({
              where: {
                id: questionFeedback.questionId,
              },
              data: {
                strengths: questionFeedback.strengths,
                weaknesses: questionFeedback.weaknesses,
              },
            })),
          },
        },
      })

      console.info("Feedback updated")
    } catch (error) {
      console.error(error.response)

      throw new Error(error)
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: error.status || 500 })
  }
}

async function getAnswerTranscription(answerAudio: string, questionId: string) {
  console.info("Generating transcription for: ", answerAudio)

  const params = {
    Bucket: env.AUDIO_BUCKET_NAME,
    Key: answerAudio,
  }

  const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: env.ACCESS_KEY_ID_AWS,
    secretAccessKey: env.SECRET_ACCESS_KEY_AWS,
    region: env.REGION,
    signatureVersion: "v4",
  })
  // Get read object stream
  const s3Stream = s3.getObject(params).createReadStream()

  // create form data to be send to whisper api
  const formData = new FormData()

  // append stream with a file
  formData.append("file", s3Stream, {
    contentType: AUDIO_TYPE,
    filename: answerAudio,
  })
  formData.append("model", "whisper-1")
  formData.append("prompt", whisperPrompt)

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + env.OPENAI_API_KEY,
      ...formData.getHeaders(),
    },
  })

  if (!res.ok) throw new Error("Error generating transcription")

  const { text: transcription } = (await res.json()) as { text: string }

  const updatedQuestion = await db.question.update({
    where: {
      id: questionId,
    },
    data: {
      transcribedAnswer: transcription,
    },
    select: {
      transcribedAnswer: true,
    },
  })

  if (!updatedQuestion.transcribedAnswer) throw new Error("Question not found")

  console.info("Transcription updated: ", updatedQuestion.transcribedAnswer)
  return updatedQuestion.transcribedAnswer
}
