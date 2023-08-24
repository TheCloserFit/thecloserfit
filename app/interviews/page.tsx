import { notFound } from "next/navigation"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { InterviewCreate } from "@/components/interview/interview-create"
import { InterviewItem } from "@/components/interview/interview-item"
import { InterviewsHeader } from "@/components/interviews-header"
import { UserDropdown } from "@/components/user-dropdown"

export default async function InterviewsPage() {
  const sessionUser = await getCurrentUser()

  if (!sessionUser) {
    return notFound()
  }

  const user = await db.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    include: {
      interviews: {
        select: {
          id: true,
          updatedAt: true,
          feedback: true,
          type: true,
          position: true,
          questions: {
            select: {
              id: true,
              question: true,
              answerAudio: true,
              strengths: true,
              weaknesses: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  })

  if (!user || !user.resume) {
    return notFound()
  }

  return (
    <div className="min-h-[80vh]">
      <InterviewsHeader
        heading="Interviews"
        text="Create and manage your interviews"
      >
        <div className="flex flex-row-reverse justify-start gap-2 sm:flex-row sm:justify-end">
          <InterviewCreate user={user} />
          <UserDropdown user={user} />
        </div>
      </InterviewsHeader>
      {user.interviews.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="empty" />
          <EmptyPlaceholder.Title>No Interviews</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You have no interviews yet. Higher the chances of getting hired now!
          </EmptyPlaceholder.Description>
          <InterviewCreate user={user} variant="outline" />
        </EmptyPlaceholder>
      ) : (
        <div className="divide-y divide-border rounded-md border">
          {user.interviews.map((interview) => (
            <InterviewItem key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  )
}
