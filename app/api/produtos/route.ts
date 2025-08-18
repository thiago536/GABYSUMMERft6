import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get("categoria")
  const busca = searchParams.get("busca")

  try {
    console.log("[v0] API GET /api/produtos - Starting request")
    console.log("[v0] Filters:", { categoria, busca })

    let query = supabase.from("produtos").select("*").eq("ativo", true).order("created_at", { ascending: false })

    if (categoria && categoria !== "TODOS") {
      query = query.eq("categoria", categoria)
    }

    if (busca) {
      query = query.ilike("nome", `%${busca}%`)
    }

    const { data: produtos, error } = await query

    console.log("[v0] Query result:", { produtos: produtos?.length, error })

    if (error) {
      console.error("Erro ao buscar produtos:", error)
      return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
    }

    return NextResponse.json(produtos)
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const produto = await request.json()

    // Validação básica
    if (!produto.nome || !produto.preco || !produto.categoria) {
      return NextResponse.json({ error: "Nome, preço e categoria são obrigatórios" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("produtos")
      .insert([
        {
          nome: produto.nome,
          descricao: produto.descricao || "",
          preco: Number.parseFloat(produto.preco),
          categoria: produto.categoria,
          cores: produto.cores || [],
          tamanhos: produto.tamanhos || [],
          imagens: produto.imagens || [],
          ativo: produto.ativo !== false,
          estoque: Number.parseInt(produto.estoque) || 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar produto:", error)
      return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const produto = await request.json()

    if (!produto.id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("produtos")
      .update({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: Number.parseFloat(produto.preco),
        categoria: produto.categoria,
        cores: produto.cores,
        tamanhos: produto.tamanhos,
        imagens: produto.imagens,
        ativo: produto.ativo,
        estoque: Number.parseInt(produto.estoque) || 0,
      })
      .eq("id", produto.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar produto:", error)
      return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    const { error } = await supabase.from("produtos").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir produto:", error)
      return NextResponse.json({ error: "Erro ao excluir produto" }, { status: 500 })
    }

    return NextResponse.json({ message: "Produto excluído com sucesso" })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
