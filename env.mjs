import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GITHUB_ACCESS_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1),
    SMTP_FROM: z.string().min(1),
    POSTMARK_API_TOKEN: z.string().min(1),
    POSTMARK_LOGIN_TEMPLATE: z.string().min(1),
    POSTMARK_REGISTER_TEMPLATE: z.string().min(1),
    POSTMARK_FEEDBACK_SUCCESS_TEMPLATE: z.string().min(1),
    POSTMARK_FEEDBACK_ERROR_TEMPLATE: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    ACCESS_KEY_ID_AWS: z.string().min(1),
    SECRET_ACCESS_KEY_AWS: z.string().min(1),
    REGION: z.string().min(1),
    AUDIO_BUCKET_NAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    SMTP_FROM: process.env.SMTP_FROM,
    POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
    POSTMARK_LOGIN_TEMPLATE: process.env.POSTMARK_LOGIN_TEMPLATE,
    POSTMARK_REGISTER_TEMPLATE: process.env.POSTMARK_REGISTER_TEMPLATE,
    POSTMARK_FEEDBACK_SUCCESS_TEMPLATE:
      process.env.POSTMARK_FEEDBACK_SUCCESS_TEMPLATE,
    POSTMARK_FEEDBACK_ERROR_TEMPLATE:
      process.env.POSTMARK_FEEDBACK_ERROR_TEMPLATE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ACCESS_KEY_ID_AWS: process.env.ACCESS_KEY_ID_AWS,
    SECRET_ACCESS_KEY_AWS: process.env.SECRET_ACCESS_KEY_AWS,
    REGION: process.env.REGION,
    AUDIO_BUCKET_NAME: process.env.AUDIO_BUCKET_NAME,
  },
})
