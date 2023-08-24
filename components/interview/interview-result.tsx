import { Interview, Question } from "@prisma/client"

import { Icons } from "../icons"
import { QuestionItem } from "./question-item"

interface InterviewResultProps {
  interview: Interview & {
    questions: Question[]
  }
}

export default function InterviewResult({ interview }: InterviewResultProps) {
  return (
    <div>
      {interview.feedback && (
        <div className="flex gap-2">
          <Icons.info className="mt-2 w-16 text-primary" />
          <h3 className="mb-4 text-sm italic sm:text-base">
            {interview.feedback}
          </h3>
        </div>
      )}
      <div className="divide-y border-y">
        {interview.questions.map((question) => (
          <QuestionItem question={question} key={question.id} />
        ))}
      </div>
    </div>
  )
}
