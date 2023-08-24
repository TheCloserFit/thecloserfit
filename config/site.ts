import { SiteConfig } from "types"
import { absoluteUrl } from "@/lib/utils"

export const siteConfig: SiteConfig = {
  name: "The Closer Fit",
  description:
    "Prepare for your next interview with The Closer Fit. Get a mock interview with an AI-powered interviewer and get feedback on your performance.",
  url: "https://thecloserfit.com",
  ogImage: absoluteUrl("/og.jpg"),
  email: "info@thecloserfit.com",
  github: "https://github.com/leonardotrapani/thecloserfit",
  keywords: ["mock interviews", "interviews", "jobs", "prepare", "ai"],
  leonardotrapani: {
    name: "Leonardo Trapani",
    email: "leonard.trapani@gmail.com",
    github: "https://github.com/leonardotrapani",
    linkedin: "https://linkedin.com/in/leonardotrapani",
  },
  roccogazzaneo: {
    name: "Rocco Gazzaneo",
    email: "roccogazzaneo1999@gmail.com",
    github: "https://github.com/roccogazzaneo",
    linkedin: "https://www.linkedin.com/in/rocco-gazzaneo-datascientist/",
  },
}
