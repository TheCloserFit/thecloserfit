import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default async function IndexPage() {
  return (
    <>
      <section className="flex min-h-screen items-center justify-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[65rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Prepare for your next interview
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Get personalized mock interviews with AI powered interviewers and
            get feedback (in real-time) on your performance. get feedback on
            your performance.
          </p>
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            Get Started
          </Link>
        </div>
      </section>
    </>
  )
}
