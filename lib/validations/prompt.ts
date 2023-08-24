import { z } from "zod"

export const questionsRequestPromptSchema = z.object({
  type: z.enum(["behavioural", "technical", "mixed"]),
  position: z.string().min(1),
  resume: z.string().min(1),
})

export const questionsResponsePromptSchema = z.object({
  questions: z.array(z.string().min(1)).min(5).max(5),
})

export const feedbackRequestPromptSchema = z.object({
  questionsAnswers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(5)
    .max(5),
  position: z.string().min(1),
  resume: z.string().min(1),
})

export const feedbackResponsePromptSchema = z.object({
  feedback: z.string().min(1),
  questionsFeedback: z
    .array(
      z.object({
        questionId: z.string().min(1),
        strengths: z.array(z.string().min(1)),
        weaknesses: z.array(z.string().min(1)),
      })
    )
    .min(5)
    .max(5),
})
