import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: Request) {
  try {
    const { codigo, whatsapp } = await request.json()

    // Buscar cupom
    const { data: cupom, error: cupomError } = await supabase
      .from("cupons")
      .select("*")
      .eq("codigo", codigo.toUpperCase())
      .eq("ativo", true)
      .single()

    if (cupomError || !cupom) {
      return NextResponse.json({
        valido: false,
        erro: "Cupom não encontrado ou inválido",
      })
    }

    // Verificar se cupom expirou
    if (cupom.data_expiracao && new Date(cupom.data_expiracao) < new Date()) {
      return NextResponse.json({
        valido: false,
        erro: "Cupom expirado",
      })
    }

    // Verificar limite de usos
    if (cupom.usos_maximos && cupom.usos_atuais >= cupom.usos_maximos) {
      return NextResponse.json({
        valido: false,
        erro: "Cupom esgotado",
      })
    }

    // Se é cupom de primeira compra, verificar cliente
    if (cupom.primeira_compra_apenas) {
      const { data: cliente } = await supabase
        .from("clientes")
        .select("primeira_compra")
        .eq("whatsapp", whatsapp)
        .single()

      if (cliente && !cliente.primeira_compra) {
        return NextResponse.json({
          valido: false,
          erro: "Este cupom é válido apenas para primeira compra",
        })
      }
    }

    return NextResponse.json({
      valido: true,
      cupom: {
        codigo: cupom.codigo,
        tipo: cupom.tipo,
        valor: cupom.valor,
        valorMaximo: cupom.valor_maximo,
      },
    })
  } catch (error) {
    console.error("Erro ao validar cupom:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
