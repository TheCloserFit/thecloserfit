"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { Balancer } from "react-wrap-balancer"
import { z } from "zod"

import { postInterviewSchema } from "@/lib/validations/interview"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Textarea } from "../ui/textarea"

interface InterviewCreateProps extends ButtonProps {
  user?: User
}

type FormData = z.infer<typeof postInterviewSchema>

export function InterviewCreate({ user, ...props }: InterviewCreateProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(postInterviewSchema),
    defaultValues: {
      position: "",
      description: undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const res = await fetch("/api/interviews", {
      method: "POST",
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

    const { id } = await res.json()

    router.push("/interviews/" + id + "/process")

    router.refresh()

    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>
          <Icons.add className="mr-2 h-4 w-4" />
          New Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Interview</DialogTitle>
          <DialogDescription>
            <Balancer>
              Please submit the form below to create a new interview.
            </Balancer>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioural">Behavioural</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Input
                    id="name"
                    placeholder="Stanford University Computer Science undergraduate"
                    size={32}
                    {...field}
                  />
                  <FormDescription>
                    The position you want to be interviewed for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    id="description"
                    placeholder="[Copied from Stanford's Website]: The optional interview provides an opportunity for Restrictive Early Action and Regular Decision applicants to have meaningful conversations with Stanford alumni. This two-way exchange allows you to learn more about Stanford while the Admission Office learns more about you. How should I prepare for my upcoming interview? The interview is meant to be an informal conversation, so no formal preparation is needed. There is no set list of questions that interviewers are required to ask, which allows for each interview to be a unique conversation.
Prior to the interview, you may want to think about:
Experiences and goals that you would like to share with your interviewer.
Academic interests and extracurricular involvements.
Questions to ask your interviewer, as this is an opportunity to learn more about Stanford. What is the role of the interviewer?
Alumni volunteers learn about you through the interview and share information with the Office of Undergraduate Admission in a report that becomes part of your admission file.
During the interview, alumni volunteers are able to share stories about their Stanford experience."
                    {...field}
                  />
                  <FormMessage />
                  <FormDescription>
                    Optional: Specify the job position details here. Copy and
                    paste the job description from the job posting. The more
                    in-depth, the better.
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="mt-2">
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Interview
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
