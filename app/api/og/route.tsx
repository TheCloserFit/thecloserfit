import { ImageResponse } from "@vercel/og"

//import { ogImageSchema } from "@/lib/validations/og"

export const runtime = "edge"

/*
const interRegular = fetch(
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

const interBold = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())
*/

export async function GET(_req: Request) {
  try {
    /*
    const fontRegular = await interRegular
    const fontBold = await interBold

    const url = new URL(req.url)
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams))
    const heading =
      values.heading.length > 140
        ? `${values.heading.substring(0, 140)}...`
        : values.heading

    const { mode } = values
    const paint = mode === "dark" ? "#fff" : "#000"

    const fontSize = heading.length > 100 ? "70px" : "100px"
    */

    return new ImageResponse(
      (
        <div className="flex h-full w-full items-center justify-center">
          <h1>The Closer Fit</h1>
        </div>
      )
    )
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
