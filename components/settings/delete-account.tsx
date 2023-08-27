"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "next-auth"
import { signOut } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { toast } from "../ui/use-toast"

interface DeleteAccountProps {
  userId: User["id"]
}

const deleteAccountSchema = z.object({
  value: z.string().refine((value) => value === "delete", {
    message: "You must type 'delete' to delete your account.",
  }),
})

type FormData = z.infer<typeof deleteAccountSchema>

export function DeleteAccount({ userId }: DeleteAccountProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {},
  })

  const onSubmit = async (data: FormData) => {
    if (data.value !== "delete") {
      return
    }

    setLoading(true)

    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      return toast({
        title: "An error occurred.",
        description: "Unable to delete your account.",
        variant: "destructive",
      })
    }

    signOut({
      callbackUrl: "/",
    })

    router.refresh()

    setLoading(false)
  }

  return (
    <Card className="border-destructive">
      <CardHeader className="text-destructive">
        <CardTitle>Delete account</CardTitle>
        <CardDescription>
          This action is irreversible. All your data will be deleted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type &quot;delete&quot; to delete the account
                  </FormLabel>
                  <Input id="name" placeholder="delete" size={32} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2" variant="destructive">
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
