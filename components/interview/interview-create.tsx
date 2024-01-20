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
                    placeholder="Intesa San Paolo Junior Software Engineer"
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
                    placeholder="[From Datapizza.tech website] Intesa Sanpaolo is the right place for you if you are passionate about technology, have a proactive approach to problem solving, and want to work in an environment of continuous innovation.

                    Technologies: PostgreSQL, MongoDB, C, C++, Java, REST API

Key Responsibilities:

🔹 Develop and innovate by creating internal products for the Bank.
🔹 Create technical and performance tests with functional analysts.

Intesa Sanpaolo offers the opportunity of a 4-day work week (4X9), comprehensive health care, and access to subsidized banking products and services.

Background: Computer Science, Computer Engineering, STEM"
                    {...field}
                  />
                  <FormMessage />
                  <FormDescription>
                    <span className="underline">Optional</span>: Specify the job
                    position details here. Copy and paste the job description
                    from the job posting. The more in-depth, the better.
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
