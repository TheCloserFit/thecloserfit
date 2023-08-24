import { useMemo } from "react"
import Link from "next/link"
import { Interview, Question } from "@prisma/client"

import { cn, formatDate, getInterviewSubtitle } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

import { Icons } from "../icons"
import { InterviewOperations } from "./interview-operations"

interface InterviewItemProps {
  interview: Pick<
    Interview,
    "id" | "type" | "position" | "updatedAt" | "feedback"
  > & {
    questions: Pick<
      Question,
      "id" | "answerAudio" | "question" | "strengths" | "weaknesses"
    >[]
  }
}

export function InterviewItem({ interview }: InterviewItemProps) {
  const isCompleted = useMemo(
    () => interview.questions.every((question) => question.answerAudio),
    [interview.questions]
  )

  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid max-w-[90%] gap-1">
        <Link
          href={`/interviews/${interview.id}`}
          className={cn("font-semibold hover:underline")}
        >
          {isCompleted && !interview.feedback && (
            <Icons.ai className="mr-2 inline h-5 w-5 text-primary" />
          )}
          {formatDate(interview.updatedAt.toDateString())}
        </Link>
        <div className="flex flex-col text-sm text-muted-foreground sm:flex-row">
          <p>{getInterviewSubtitle(interview)}</p>
        </div>
      </div>
      <InterviewOperations interviewId={interview.id} />
    </div>
  )
}

InterviewItem.Skeleton = function SectionItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
