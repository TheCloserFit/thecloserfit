import PDFParser from "pdf-parse"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export const revalidate = 0

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const data = await req.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return new Response("No file found", { status: 422 })
    }

    // 1MB
    if (file.size > 1 * 1024 * 1024) {
      return new Response("File too large", { status: 422 })
    }

    // Read the PDF file content
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const pdfData = await PDFParser(fileBuffer)

    const fileText = pdfData.text.trim() // Extracted text from the PDF

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        resume: fileText,
      },
    })

    return new Response(JSON.stringify(updatedUser), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
