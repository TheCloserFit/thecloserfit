"use client"

import { User } from "@prisma/client"
import Balancer from "react-wrap-balancer"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Icons } from "../icons"
import { Button } from "../ui/button"
import { DialogHeader } from "../ui/dialog"
import { OnboardinFile } from "./file"

interface ResumeEditProps {
  user: Pick<User, "resume">
}

export function ResumeEdit({ user }: ResumeEditProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume</CardTitle>
        <Dialog>
          {!!user.resume && (
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="m-0 justify-start p-0 text-foreground"
              >
                <Icons.eye className="mr-2 h-4 w-4" />
                View resume extracted text
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="w-full sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Resume extracted text</DialogTitle>
              <DialogDescription>
                <Balancer>
                  The resume extracted from the uploaded file. If the format is
                  not correct, do not worry, the important thing is that there
                  is a text.
                </Balancer>
              </DialogDescription>
            </DialogHeader>
            <Balancer className="max-h-[500px] overflow-y-scroll text-sm">
              {user?.resume}
            </Balancer>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <OnboardinFile className="w-full max-w-full border-none" />
      </CardContent>
    </Card>
  )
}
