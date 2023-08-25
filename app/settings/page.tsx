import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { InterviewsHeader } from "@/components/interviews-header"
import { DeleteAccount } from "@/components/settings/delete-account"
import { ResumeEdit } from "@/components/settings/resume-edit"
import { UserDropdown } from "@/components/user-dropdown"
import { UserNameForm } from "@/components/user-name-form"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function SettingsPage() {
  const sessionUser = await getCurrentUser()

  if (!sessionUser) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const user = await db.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      id: true,
      resume: true,
    },
  })

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <div>
      <Link
        href="/interviews"
        className={cn(buttonVariants({ variant: "ghost" }), "mt-4")}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Back
      </Link>
      <InterviewsHeader
        heading="Settings"
        text="Manage account and website settings."
      >
        <UserDropdown user={sessionUser} />
      </InterviewsHeader>
      <div className="grid gap-10">
        <UserNameForm
          user={{ id: sessionUser.id, name: sessionUser.name || "" }}
        />
        <ResumeEdit user={user} />
        <DeleteAccount userId={sessionUser.id} />
      </div>
    </div>
  )
}
