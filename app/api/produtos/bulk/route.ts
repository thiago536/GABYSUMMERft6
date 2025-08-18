import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function PUT(request: NextRequest) {
  try {
    const { ids, ativo } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "IDs são obrigatórios" }, { status: 400 })
    }

    const { data, error } = await supabase.from("produtos").update({ ativo }).in("id", ids).select()

    if (error) {
      console.error("Erro do Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro na API:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
