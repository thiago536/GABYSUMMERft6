import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] API GET /api/produtos/[id] - Product ID:", params.id)

    const { data: produto, error } = await supabase
      .from("produtos")
      .select(`
        *,
        avaliacoes (
          id,
          nota,
          comentario,
          created_at,
          clientes (nome)
        )
      `)
      .eq("id", params.id)
      .eq("ativo", true)
      .single()

    console.log("[v0] Product query result:", { produto, error })

    if (error) {
      console.error("Erro ao buscar produto:", error)
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json(produto)
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
