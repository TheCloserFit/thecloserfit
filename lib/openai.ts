/*
import { Configuration, OpenAIApi } from "openai"

import { env } from "@/env.mjs"

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
})
export const openai = new OpenAIApi(configuration)
*/

import OpenAI from "openai"

export const openai = new OpenAI()
