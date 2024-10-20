"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Question } from "@prisma/client"

import { Icons } from "../icons"
import { Button, ButtonProps } from "../ui/button"
import { toast } from "../ui/use-toast"

interface InterviewGetFeedbackProps extends ButtonProps {
  interviewId: string
  questions: Question[]
}

export function InterviewGetFeedback({
  questions,
  interviewId,
}: InterviewGetFeedbackProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getFeedback = useCallback(async () => {
    setLoading(true)
    toast({
      title: "Hold on...",
      description:
        "We're generating your feedback. It could take up to 1 minute.",
    })
    const res = await fetch(`/api/interviews/${interviewId}/feedback`, {
      method: "POST",
    })

    if (!res.ok) {
      setLoading(false)
      toast({
        title: "An error has occurred.",
        description:
          "Your feedback could not be created saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()
  }, [interviewId, router])

  useEffect(() => {
    if (!questions.every((question) => !!question.answerAudio)) return
    getFeedback()
  }, [getFeedback, questions])

  return (
    <Button onClick={getFeedback} disabled={loading}>
      {loading ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : (
        <Icons.ai className="mr-2 size-4" />
      )}
      Get Feedback
    </Button>
  )
}
