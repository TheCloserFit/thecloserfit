import { notFound, redirect } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import InterviewProcessWrapper from "@/components/interview/interview-process-wrapper"

interface InterviewProcessProps {
  params: { interviewId: string }
}

export default async function SectionPage({ params }: InterviewProcessProps) {
  const user = await getCurrentUser()

  if (!user) {
    return notFound()
  }

  const interview = await db.interview.findUnique({
    where: {
      id: params.interviewId,
      userId: user.id,
    },
    include: {
      questions: {
        where: {
          answerAudio: null,
        },
      },
    },
  })

  if (!interview) {
    return notFound()
  }

  if (!interview.questions.length) {
    redirect(`/interviews/${interview.id}`)
  }

  return <InterviewProcessWrapper interview={interview} />
}
