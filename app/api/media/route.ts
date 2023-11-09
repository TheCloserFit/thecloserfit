import { randomUUID } from "crypto"
import S3 from "aws-sdk/clients/s3"

import { env } from "@/env.mjs"
import { AUDIO_TYPE } from "@/config/audio-type"

export const revalidate = 0

export async function GET(_req: Request) {
  try {
    const ex = AUDIO_TYPE.split("/")[1]
    const Key = `${randomUUID()}.${ex}`

    const s3 = new S3({
      apiVersion: "2006-03-01",
      accessKeyId: env.ACCESS_KEY_ID_AWS,
      secretAccessKey: env.SECRET_ACCESS_KEY_AWS,
      region: env.REGION,
      signatureVersion: "v4",
    })

    const s3Params = {
      Bucket: env.AUDIO_BUCKET_NAME,
      Key,
      Expires: 60 * 5,
      ContentType: AUDIO_TYPE,
    }

    const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params)

    console.info("Got upload URL: ", uploadURL)

    return new Response(JSON.stringify({ uploadURL, key: Key }), {
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
