"use client"

import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { FileRejection, useDropzone } from "react-dropzone"
import { Balancer } from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const MAX_RESUME_SIZE = 1024 * 1024 * 1 // 1MB

interface OnboardinFileProps extends React.HTMLAttributes<HTMLDivElement> {
  redirect?: string
}

export function OnboardinFile({
  className,
  redirect,
  ...props
}: OnboardinFileProps) {
  const router = useRouter()

  const [loading, setLoading] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)

  const onDrop = useCallback(async ([file]: File[]) => {
    setFile(file)
  }, [])

  const onError = useCallback((error: Error) => {
    toast({
      title: "An error has occurred",
      description: error.message,
      variant: "destructive",
    })
  }, [])

  const onDropRejected = useCallback(([fileRejection]: FileRejection[]) => {
    const errorMessage =
      fileRejection.errors[0].code === "file-invalid-type"
        ? "File type must be .pdf"
        : fileRejection.errors[0].code === "file-too-large"
        ? "File size must be less than " + "1MB"
        : fileRejection.errors[0].message

    toast({
      title: "The file was rejected",
      description: errorMessage,
      variant: "destructive",
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    onDropRejected,
    onError,
    maxFiles: 1,
    maxSize: MAX_RESUME_SIZE,
    accept: {
      "applicaton/pdf": [".pdf"],
    },
  })

  const parseResume = async () => {
    if (!file) return

    const data = new FormData()
    data.set("file", file)

    if (!file) {
      return new Response("No file found", { status: 422 })
    }

    const res = await fetch("/api/resume/parse", {
      method: "POST",
      body: data,
    })

    if (!res.ok) {
      toast({
        title: "An error has occurred",
        description: "Failed to parse the text of your resume",
        variant: "destructive",
      })
      return
    }

    if (redirect) {
      router.replace(redirect)
    }

    router.refresh()

    setFile(null)

    toast({
      title: "Success",
      description:
        "We have successfully recieved your resume. Welcome to thecloserfit!",
    })

    setLoading(false)
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "mx-auto flex h-72 w-full max-w-lg items-center justify-center rounded-lg border px-4",
        !loading && "cursor-pointer",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} disabled={loading} />
      <div className="max-w-lg space-y-4">
        {isDragActive ? (
          <p>Drop the resume here ...</p>
        ) : !!file ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="break-all text-center text-sm font-semibold text-muted-foreground sm:text-base">
              {file.name}
            </p>
            <Button
              disabled={loading}
              onClick={async (e) => {
                e.stopPropagation()
                setLoading(true)
                await parseResume()
              }}
            >
              {loading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.extract className="mr-2 h-4 w-4" />
              )}
              Extract Resume Text
            </Button>
          </div>
        ) : (
          <>
            <Balancer className="text-center text-sm sm:text-base">
              Drag and drop your resume here, or click to select the resume to
              generate a personalized interview. We will not save your resume,
              we will only extract the text from it.
            </Balancer>
            <p className="text-center text-muted-foreground">.pdf (1MB)</p>
          </>
        )}
      </div>
    </div>
  )
}
