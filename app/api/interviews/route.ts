import { z } from "zod"

import { db } from "@/lib/db"
import { openai } from "@/lib/openai"
import { questionsPrompt } from "@/lib/prompt"
import { getCurrentUser } from "@/lib/session"
import { postInterviewSchema } from "@/lib/validations/interview"
import {
  questionsRequestPromptSchema,
  questionsResponsePromptSchema,
} from "@/lib/validations/prompt"

export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser()

    if (!sessionUser) {
      return new Response(null, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: {
        id: sessionUser.id,
      },
    })

    if (!user) {
      return new Response(null, { status: 401 })
    }

    const body = await req.json()
    const parsedBody = postInterviewSchema.parse(body)

    const promptRequest = {
      type: parsedBody.type,
      position: parsedBody.position,
      description: parsedBody.description,
      resume: user.resume,
    }

    const parsedPromptRequest =
      questionsRequestPromptSchema.parse(promptRequest)

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: questionsPrompt,
        },
        {
          role: "user",
          content: JSON.stringify(parsedPromptRequest),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 1.2,
    })

    const message = response.choices[0].message?.content

    if (!message)
      return new Response("No response from openai", {
        status: 400,
      })

    const messageObject = JSON.parse(message)
    const parsedMessage = questionsResponsePromptSchema.parse(messageObject)

    const interview = await db.interview.create({
      data: {
        userId: user.id,
        type: parsedBody.type,
        position: parsedBody.position,
        description: parsedBody.description,
        questions: {
          create: parsedMessage.questions.map((question) => ({
            question,
          })),
        },
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(interview), { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
