import * as React from "react"
import { User } from "@prisma/client"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { UserDropdown } from "@/components/user-dropdown"

interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  user?: Pick<User, "image" | "name" | "email">
}

export function SiteFooter({ user, className }: SiteFooterProps) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo width={30} />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by&nbsp;
            <a
              href={siteConfig.leonardotrapani.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.leonardotrapani.name}
            </a>
            <br className="md:hidden" />
            &nbsp;and&nbsp;
            <a
              href={siteConfig.roccogazzaneo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.roccogazzaneo.name}
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user && <UserDropdown user={user} />}
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
