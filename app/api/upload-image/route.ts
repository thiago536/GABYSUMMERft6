import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Mock image upload - processing request")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Generate a placeholder URL for the uploaded image
    const mockUrl = `/placeholder.svg?height=400&width=400&query=produto+${fileName}`

    console.log("[v0] Mock upload concluído, URL:", mockUrl)

    return NextResponse.json({ url: mockUrl })
  } catch (error: any) {
    console.error("[v0] Erro inesperado no upload:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
