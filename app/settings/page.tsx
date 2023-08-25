import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { InterviewsHeader } from "@/components/interviews-header"
import { ResumeEdit } from "@/components/onboarding/resume-edit"
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
      resume: true,
    },
  })

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  return (
    <div>
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
      </div>
    </div>
  )
}
