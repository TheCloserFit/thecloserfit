import { Interview, Question } from "@prisma/client"

import { QuestionItem } from "./question-item"

interface InterviewResultProps {
  interview: Interview & {
    questions: Question[]
  }
}

export default function InterviewResult({ interview }: InterviewResultProps) {
  return (
    <div className="border-t">
      {interview.feedback && (
        <div className="my-4">
          <h3 className="text-lg font-semibold sm:text-xl">Overall Feedback</h3>
          <p className="text-sm italic sm:text-base">{interview.feedback}</p>
        </div>
      )}
      <div className="divide-y border-y">
        {interview.questions.map((question, i) => (
          <QuestionItem question={question} i={i} key={question.id} />
        ))}
      </div>
    </div>
  )
}
