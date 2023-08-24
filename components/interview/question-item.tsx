"use client"

import { useState } from "react"
import { Question } from "@prisma/client"
import { Balancer } from "react-wrap-balancer"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

interface QuestionItemProps {
  question: Question
}

export function QuestionItem({ question }: QuestionItemProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="flex flex-col justify-between rounded py-4">
        <div className="flex flex-col-reverse items-end sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <Balancer className="self-start text-left text-base font-semibold sm:text-lg">
            {question.question}
          </Balancer>
          {!!question.answerAudio && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="aspect-square h-6 p-0"
              >
                {expanded ? (
                  <Icons.collapse className="h-4 w-4" />
                ) : (
                  <Icons.open className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
        <CollapsibleContent>
          <div className="mb-1 flex flex-col py-2 text-sm text-muted-foreground sm:flex-row">
            <p>{question.transcribedAnswer}</p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            {question.strengths.length > 0 && (
              <StrengthWeaknessItem
                items={question.strengths}
                title="Strenghts"
                iconName="strength"
              />
            )}
            {question.weaknesses.length > 0 && (
              <StrengthWeaknessItem
                items={question.weaknesses}
                title="Weaknesses"
                iconName="weakness"
              />
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function StrengthWeaknessItem({
  items,
  title,
  iconName,
}: {
  items: string[]
  title: string
  iconName: keyof typeof Icons
}) {
  const Icon = Icons[iconName]
  return (
    <div className="flex-1 space-y-2 rounded border px-3 py-2">
      <div className="flex items-center">
        <Icon className="mr-2 h-4 w-4 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((item, i) => (
          <li className="ml-4 list-decimal" key={i}>
            <p>{item}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

QuestionItem.Skeleton = function SectionItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
