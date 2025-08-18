import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const {
      nome,
      whatsapp,
      email,
      primeira_compra = true,
      total_pedidos = 0,
      valor_total_gasto = 0,
    } = await request.json()

    // Verificar se cliente já existe
    const { data: clienteExistente } = await supabase.from("clientes").select("*").eq("whatsapp", whatsapp).single()

    if (clienteExistente) {
      return NextResponse.json({
        cliente: clienteExistente,
        primeiraCompra: clienteExistente.primeira_compra,
      })
    }

    // Criar novo cliente
    const { data: novoCliente, error } = await supabase
      .from("clientes")
      .insert([
        {
          nome,
          whatsapp,
          email,
          primeira_compra,
          total_pedidos,
          valor_total_gasto,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar cliente:", error)
      return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
    }

    return NextResponse.json({
      cliente: novoCliente,
      primeiraCompra: true,
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const whatsapp = searchParams.get("whatsapp")

  if (!whatsapp) {
    return NextResponse.json({ error: "WhatsApp é obrigatório" }, { status: 400 })
  }

  try {
    const { data: cliente, error } = await supabase.from("clientes").select("*").eq("whatsapp", whatsapp).single()

    if (error && error.code !== "PGRST116") {
      console.error("Erro ao buscar cliente:", error)
      return NextResponse.json({ error: "Erro ao buscar cliente" }, { status: 500 })
    }

    return NextResponse.json({
      cliente: cliente || null,
      primeiraCompra: cliente ? cliente.primeira_compra : true,
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
