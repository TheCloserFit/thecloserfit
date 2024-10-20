import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { signOut } from "next-auth/react"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn, formatDate, getInterviewSubtitle } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { InterviewGetFeedback } from "@/components/interview/interview-get-feedback"
import InterviewResult from "@/components/interview/interview-result"
import { InterviewsHeader } from "@/components/interviews-header"
import { UserDropdown } from "@/components/user-dropdown"

interface InterviewPageProps {
  params: { interviewId: string }
}

export default async function SectionPage({ params }: InterviewPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    signOut()
    return notFound()
  }

  const interview = await db.interview.findUnique({
    where: {
      id: params.interviewId,
      userId: user.id,
    },
    include: {
      questions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!interview || !interview.questions.length) {
    return notFound()
  }

  const finished =
    interview.questions.length > 0 &&
    interview.questions.every((question) => !!question.answerAudio)

  if (!finished) {
    redirect(`/interviews/${interview.id}/process`)
  }

  return (
    <div>
      <Link
        href="/interviews"
        className={cn(buttonVariants({ variant: "ghost" }), "mt-4")}
      >
        <Icons.chevronLeft className="mr-2 size-4" />
        Back
      </Link>
      <InterviewsHeader
        heading={formatDate(interview.updatedAt.toDateString())}
        showUnderline
        text={getInterviewSubtitle(interview)}
        className="mt-0"
      >
        {!interview.feedback && (
          <div className="flex flex-row-reverse justify-start gap-2 sm:flex-row sm:justify-end">
            <InterviewGetFeedback
              interviewId={interview.id}
              questions={interview.questions}
            >
              Get feedback
            </InterviewGetFeedback>
            <UserDropdown user={user} />
          </div>
        )}
      </InterviewsHeader>
      {interview.description && (
        <p className="mb-2 -translate-y-2 px-2 text-sm italic sm:text-base">
          {interview.description}
        </p>
      )}
      <InterviewResult interview={interview} />
    </div>
  )
}
