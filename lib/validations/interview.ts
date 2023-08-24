import { z } from "zod"

export const postInterviewSchema = z.object({
  type: z.enum(["technical", "behavioural", "mixed"]),
  position: z.string().min(1),
})

export const postInterviewAnswerSchema = z.object({
  questionId: z.string().min(1),
  answerAudio: z.string().min(1),
})
