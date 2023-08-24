"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Icons } from "../icons"
import { Button, ButtonProps } from "../ui/button"
import { toast } from "../ui/use-toast"

interface InterviewGetFeedbackProps extends ButtonProps {
  interviewId: string
}

export function InterviewGetFeedback({
  interviewId,
}: InterviewGetFeedbackProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getFeedback = async () => {
    setLoading(true)
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
  }

  return (
    <Button onClick={getFeedback} disabled={loading}>
      {loading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.ai className="mr-2 h-4 w-4" />
      )}
      Get Feedback
    </Button>
  )
}
