import { z } from "zod"

import { verifyUserHasAccessToInterviewAndQuestion } from "@/lib/access"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { postInterviewAnswerSchema } from "@/lib/validations/interview"

import { generateFeedback } from "../feedback/route"

const routeContextSchema = z.object({
  params: z.object({
    interviewId: z.string(),
  }),
})

export const revalidate = 0

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const sessionUser = await getCurrentUser()

    if (!sessionUser) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const parsedBody = postInterviewAnswerSchema.parse(body)

    if (
      !(await verifyUserHasAccessToInterviewAndQuestion(
        sessionUser.id,
        params.interviewId,
        parsedBody.questionId
      ))
    ) {
      return new Response("Unauthorized", { status: 401 })
    }

    const updatedQuestion = await db.question.update({
      where: {
        id: parsedBody.questionId,
      },
      data: {
        answerAudio: parsedBody.answerAudio,
      },
    })

    const questions = await db.question.findMany({
      where: {
        interview: {
          userId: sessionUser.id,
          id: params.interviewId,
        },
      },
    })

    const interview = await db.interview.findUnique({
      where: {
        id: params.interviewId,
      },
    })

    if (!interview) return new Response(null, { status: 404 })

    if (questions.every((question) => !!question.answerAudio)) {
      console.info("Starting generate feedback")
      generateFeedback(params.interviewId, sessionUser.id, questions, interview)
      console.info("Passed generate feedback")
    }

    return new Response(JSON.stringify(updatedQuestion), { status: 200 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: error.status || 500 })
  }
}
