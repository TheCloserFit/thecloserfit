import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { editTranscribedAnswerSchema } from "@/lib/validations/interview"

const routeContextSchema = z.object({
  params: z.object({
    questionId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route context.
    const { params } = routeContextSchema.parse(context)

    // Ensure user is authentication and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(null, { status: 403 })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = editTranscribedAnswerSchema.parse(body)

    // Update the user.
    await db.question.update({
      where: {
        interview: {
          userId: session.user.id,
        },
        id: params.questionId,
      },
      data: {
        transcribedAnswer: payload.transcribedAnswer,
        strengths: [],
        weaknesses: [],
        interview: {
          update: {
            feedback: null,
          },
        },
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
