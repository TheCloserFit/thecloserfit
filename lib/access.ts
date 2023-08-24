import { argv0 } from "process"
import { Interview, Question, User } from "@prisma/client"

import { db } from "./db"

export const verifyUserHasAccessToInterviewAndQuestion = async (
  userId: User["id"],
  interviewId: Interview["id"],
  questionId: Question["id"]
) => {
  const count = await db.question.count({
    where: {
      id: questionId,
      interview: {
        id: interviewId,
        userId,
      },
    },
  })
  return count > 0
}

export const verifyUserHasAccessToInterview = async (
  userId: User["id"],
  interviewId: Interview["id"]
) => {
  const count = await db.interview.count({
    where: {
      id: interviewId,
      userId,
    },
  })
  return count > 0
}
