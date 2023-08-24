import { User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/icons"

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  github: string
  email: string
  leonardotrapani: Author
  roccogazzaneo: Author
  keywords: string[]
}

type Author = {
  name: string
  email: string
  github: string
  linkedin: string
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> &
  (
    | {
        stripeCurrentPeriodEnd: number | null
        isPro: false
      }
    | {
        stripeCurrentPeriodEnd: number
        isPro: true
      }
  )

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId?: string
}
