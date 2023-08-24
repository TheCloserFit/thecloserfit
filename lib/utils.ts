import { Interview, Question } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getInterviewSubtitle(
  interview: Pick<
    Interview,
    "id" | "feedback" | "type" | "position" | "generatingFeedback"
  > & {
    questions: Pick<Question, "id" | "answerAudio">[]
  }
) {
  const hasFeedback = !!interview.feedback
  const isIncomplete = interview.questions.some(
    (question) => !question.answerAudio
  )
  const type = interview.type[0].toUpperCase() + interview.type.slice(1)
  const state = interview.generatingFeedback
    ? "Generating Feedback"
    : isIncomplete
    ? "Incomplete"
    : hasFeedback
    ? "Completed"
    : "Waiting for review"

  return state + ", " + type + ", " + interview.position
}
