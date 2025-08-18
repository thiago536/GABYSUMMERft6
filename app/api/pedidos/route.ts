import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const { cliente, itens, subtotal, desconto, frete, total, cupomCodigo, observacoes } = await request.json()

    // Criar ou atualizar cliente
    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .upsert(
        [
          {
            nome: cliente.nome,
            whatsapp: cliente.whatsapp,
            email: cliente.email || null,
          },
        ],
        { onConflict: "whatsapp" },
      )
      .select()
      .single()

    if (clienteError) {
      console.error("Erro ao criar/atualizar cliente:", clienteError)
      return NextResponse.json({ error: "Erro ao processar cliente" }, { status: 500 })
    }

    // Criar pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          cliente_id: clienteData.id,
          subtotal,
          desconto,
          frete,
          total,
          cupom_codigo: cupomCodigo,
          observacoes,
          status: "pendente",
        },
      ])
      .select()
      .single()

    if (pedidoError) {
      console.error("Erro ao criar pedido:", pedidoError)
      return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 })
    }

    // Criar itens do pedido
    const itensParaInserir = itens.map((item: any) => ({
      pedido_id: pedido.id,
      produto_id: item.id,
      quantidade: item.quantity,
      preco_unitario: item.preco,
      cor: item.selectedColor,
      tamanho: item.selectedSize,
    }))

    const { error: itensError } = await supabase.from("itens_pedido").insert(itensParaInserir)

    if (itensError) {
      console.error("Erro ao criar itens do pedido:", itensError)
      return NextResponse.json({ error: "Erro ao criar itens do pedido" }, { status: 500 })
    }

    // Atualizar estatísticas do cliente
    await supabase
      .from("clientes")
      .update({
        primeira_compra: false,
        total_pedidos: clienteData.total_pedidos + 1,
        valor_total_gasto: (clienteData.valor_total_gasto || 0) + total,
      })
      .eq("id", clienteData.id)

    // Se usou cupom, incrementar uso
    if (cupomCodigo) {
      await supabase
        .from("cupons")
        .update({ usos_atuais: supabase.raw("usos_atuais + 1") })
        .eq("codigo", cupomCodigo)
    }

    return NextResponse.json({
      sucesso: true,
      pedido: {
        id: pedido.id,
        numero: `GB${pedido.id.toString().padStart(6, "0")}`,
      },
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
