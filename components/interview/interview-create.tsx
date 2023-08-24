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
                    placeholder="Junior NextJS Developer for a startup"
                    size={32}
                    {...field}
                  />
                  <FormDescription>
                    The position you want to be interviewed for. You can also go
                    in depth with the job position details (key values,
                    technologies, etc.)
                  </FormDescription>
                  <FormMessage />
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