import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Balancer } from "react-wrap-balancer"

import { useRecord } from "@/hooks/use-record"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"

interface InterviewProcessProps {
  question: string
  onNextQuestion: (transcript: string) => void
  isLast: boolean
  loading: boolean
  setLoading: (loading: boolean) => void
  i: number
  length: number
}

export default function InterviewProcess({
  question,
  isLast,
  loading,
  i,
  length,
  setLoading,
  onNextQuestion,
}: InterviewProcessProps) {
  const router = useRouter()
  const onStop = useCallback(
    async (file: File) => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/api/media/`)
        const { uploadURL, key } = data
        await axios.put(uploadURL, file)

        onNextQuestion(key)

        if (isLast) {
          router.refresh()
          toast({
            title: "Interview Finished",
            description: "Thank you for your time!",
          })
        }
      } catch (err) {
        toast({
          title: "Could not save answer",
          description: "Your answer could not be saved. Please try again",
          variant: "destructive",
        })
        setLoading(false)
      }
    },
    [isLast, onNextQuestion, router, setLoading]
  )

  const { volume, isRecording, stopRecording, startRecording } =
    useRecord(onStop)

  useEffect(() => {
    startRecording()
  }, [startRecording, stopRecording, question])

  return (
    <div>
      <div className="relative flex h-screen flex-col items-center justify-center gap-8">
        {isRecording && (
          <div
            className={"absolute -z-10 aspect-video opacity-70 transition-all"}
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, hsl(var(--primary)) 5%, transparent 66%)",
              height: 20 + (180 * volume) / 100 + "%",
            }}
          />
        )}
        <div className="flex items-center justify-center">
          <p className="font-bold text-lg sm:text-xl mr-4">
            {i} / {length}
          </p>
          <div className="size-16 bg-transparent border-2 border-foreground rounded-full flex items-center justify-center">
            <Icons.microphone className="size-12 text-primary" />
          </div>
        </div>
        <Balancer className="text-center font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
          {question}
        </Balancer>
        <Button onClick={stopRecording} disabled={!isRecording}>
          {loading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          {isLast ? "Finish Interview" : "Next Question"}
        </Button>
      </div>
    </div>
  )
}

interface IndicationProps {
  setShowIndications: (show: boolean) => void
}

InterviewProcess.Indications = function Indications({
  setShowIndications,
}: IndicationProps) {
  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col items-center justify-center gap-2 px-2">
      <Balancer className="text-center font-heading text-3xl sm:text-4xl">
        You will be asked a series of questions.
      </Balancer>
      <Balancer className="text-center">
        Choose a comfortable spot and use your microphone to answer the
        questions, whenever you feel ready! Behave as if you were in a real
        interview and try to answer as best as you can.
      </Balancer>
      <div className="mt-2 flex items-center justify-center gap-2">
        <Icons.hint className="size-6 text-blue-300" />
        <p className="textstart sm:text-center">
          Remember to keep your answer concise!
        </p>
      </div>
      <Button
        onClick={() => setShowIndications(false)}
        className="mt-4"
        size="lg"
      >
        Ready!
      </Button>
    </div>
  )
}
