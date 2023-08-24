import { z } from "zod"

import { verifyUserHasAccessToInterview } from "@/lib/access"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    interviewId: z.string(),
  }),
})

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    const user = await getCurrentUser()

    if (!user) {
      return new Response(null, { status: 401 })
    }

    if (!(await verifyUserHasAccessToInterview(user.id, params.interviewId))) {
      return new Response(null, { status: 403 })
    }

    await db.interview.delete({
      where: {
        id: params.interviewId,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
