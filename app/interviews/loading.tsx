import { Skeleton } from "@/components/ui/skeleton"
import { InterviewCreate } from "@/components/interview/interview-create"
import { InterviewItem } from "@/components/interview/interview-item"
import { InterviewsHeader } from "@/components/interviews-header"

export default function InterviewsLoading() {
  return (
    <div>
      <InterviewsHeader
        heading="Interviews"
        text="Create and manage your interviews"
      >
        <div className="flex flex-row-reverse justify-start gap-2 sm:flex-row sm:justify-end">
          <InterviewCreate />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </InterviewsHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <InterviewItem.Skeleton />
        <InterviewItem.Skeleton />
        <InterviewItem.Skeleton />
        <InterviewItem.Skeleton />
        <InterviewItem.Skeleton />
        <InterviewItem.Skeleton />
      </div>
    </div>
  )
}
