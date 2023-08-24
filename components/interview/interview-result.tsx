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
      {interview.generatingFeedback && (
        <div className="mb-12 mt-8 flex flex-col items-center justify-center sm:flex-row">
          <Icons.warning className="mr-2 text-primary" size={30} />
          <h2 className="text-center font-heading text-2xl underline decoration-primary">
            Generating feedback, check your inbox...
          </h2>
        </div>
      )}
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
