import { notFound, redirect } from "next/navigation"
import { signOut } from "next-auth/react"

import { getCurrentUser } from "@/lib/session"
import { SiteFooter } from "@/components/site-footer"

interface OnboardingLayoutProps {
  children?: React.ReactNode
}

export default async function OnboardingLayout({
  children,
}: OnboardingLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    signOut()
    return notFound()
  }

  if (user.hasResume) {
    redirect("/interviews")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <SiteFooter className="border-t" />
    </div>
  )
}
