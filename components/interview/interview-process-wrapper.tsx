"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Interview, Question } from "@prisma/client"

import { toast } from "../ui/use-toast"
import InterviewProcess from "./interview-process"

interface InterviewProcessWrapperProps {
  interview: Interview & { questions: Question[] }
}

export default function InterviewProcessWrapper({
  interview,
}: InterviewProcessWrapperProps) {
  const [showIndications, setShowIndications] = useState(true)

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const isLast = interview.questions.length <= 1

  const currentQuestion = interview.questions[0] // on next step we will shift the array

  const onNextQuestion = useCallback(
    async (audioUrl: string) => {
      const res = await fetch(`/api/interviews/${interview.id}/answer`, {
        method: "POST",
        body: JSON.stringify({
          answerAudio: audioUrl,
          questionId: currentQuestion.id,
        }),
      })

      setLoading(false)

      if (!res.ok) {
        return toast({
          title: "An error has occurred.",
          description:
            "Your answer could not be created saved. Please try again.",
          variant: "destructive",
        })
      }

      if (isLast) {
        router.push("/interviews/" + interview.id)
        return
      }

      interview.questions.shift()
    },
    [currentQuestion.id, interview.id, interview.questions, isLast, router]
  )

  if (showIndications) {
    return (
      <InterviewProcess.Indications setShowIndications={setShowIndications} />
    )
  }

  return (
    <InterviewProcess
      question={currentQuestion.question}
      onNextQuestion={onNextQuestion}
      length={4}
      loading={loading}
      i={4 - interview.questions.length + 1}
      setLoading={setLoading}
      isLast={isLast}
    />
  )
}
