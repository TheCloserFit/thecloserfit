"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Question } from "@prisma/client"
import { useForm } from "react-hook-form"
import { Balancer } from "react-wrap-balancer"
import { z } from "zod"

import { editTranscribedAnswerSchema } from "@/lib/validations/interview"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

import { DialogFooter } from "../ui/dialog"
import { Form, FormField, FormItem, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { toast } from "../ui/use-toast"

interface QuestionItemProps {
  question: Question
  i: number
}

type FormData = z.infer<typeof editTranscribedAnswerSchema>

export function QuestionItem({ question, i }: QuestionItemProps) {
  const [expanded, setExpanded] = useState(i === 0 ? true : false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(editTranscribedAnswerSchema),
    defaultValues: {
      transcribedAnswer: question.transcribedAnswer || "",
    },
  })

  useEffect(() => {
    form.reset({
      transcribedAnswer: question.transcribedAnswer || "",
    })
  }, [form, question.transcribedAnswer])

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const res = await fetch(`/api/questions/${question.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      return toast({
        title: "An error has occurred",
        description: "Please try again later.",
        variant: "destructive",
      })
    }

    router.refresh()

    setLoading(false)
    setEditing(false)
  }

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="flex flex-col justify-between rounded py-4">
        <div className="flex flex-col-reverse items-end sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <Balancer className="self-start text-left text-base font-semibold sm:text-lg">
            {question.question}
          </Balancer>
          {!!question.transcribedAnswer && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="aspect-square h-6 p-0"
              >
                {expanded ? (
                  <Icons.collapse className="size-4" />
                ) : (
                  <Icons.open className="size-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>
        <CollapsibleContent>
          {editing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-1 my-4"
              >
                <FormField
                  control={form.control}
                  name="transcribedAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea id="transcribedAnswer" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="mt-2" size="sm">
                    {loading && (
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                    )}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            question.transcribedAnswer && (
              <div className="mb-1 py-2 text-sm text-muted-foreground flex items-center">
                <p>{question.transcribedAnswer}</p>
                {
                  <Button
                    variant="link"
                    size="icon"
                    className="m-0 p-0"
                    onClick={() => setEditing(true)}
                  >
                    <Icons.edit className="size-4 m-0 p-0" />
                  </Button>
                }
              </div>
            )
          )}
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
        <Icon className="mr-2 size-4 text-primary" />
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
