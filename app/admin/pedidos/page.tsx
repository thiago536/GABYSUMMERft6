"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AdminPedidos() {
  const [currentDate, setCurrentDate] = useState("")
  const [activeMenu, setActiveMenu] = useState("pedidos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState("hoje")
  const [busca, setBusca] = useState("")
  const [ordenacao, setOrdenacao] = useState("recentes")
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("gabyAdminAuth")
    if (!isAuth) {
      router.push("/admin")
      return
    }

    // Set current date
    const now = new Date()
    setCurrentDate(
      now.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    loadPedidos()
  }, [router])

  const loadPedidos = async () => {
    try {
      setLoading(true)

      const { data: pedidosData, error } = await supabase
        .from("pedidos")
        .select(`
          *,
          clientes (nome, whatsapp),
          itens_pedido (
            *,
            produtos (nome)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      const pedidosFormatados = pedidosData.map((pedido) => ({
        id: `GS${pedido.id.toString().padStart(3, "0")}`,
        cliente: pedido.clientes?.nome || "Cliente não encontrado",
        whatsapp: pedido.clientes?.whatsapp || "",
        produtos: pedido.itens_pedido.map((item) => ({
          nome: item.produtos?.nome || "Produto não encontrado",
          tamanho: item.tamanho,
          cor: item.cor,
          preco: Number(item.preco_unitario),
          quantidade: item.quantidade,
        })),
        total: Number(pedido.total),
        status: pedido.status,
        data: new Date(pedido.created_at),
        observacoes: pedido.observacoes || "",
        historico: [
          {
            status: pedido.status,
            data: new Date(pedido.created_at),
            observacao: `Pedido ${pedido.status}`,
          },
        ],
        pedidoId: pedido.id,
      }))

      setPedidos(pedidosFormatados)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
      alert("Erro ao carregar pedidos")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("gabyAdminAuth")
    router.push("/admin")
  }

  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard", href: "/admin/dashboard" },
    { id: "produtos", icon: "👙", label: "Produtos", href: "/admin/produtos" },
    { id: "pedidos", icon: "📱", label: "Pedidos", href: "/admin/pedidos" },
    { id: "relatorios", icon: "📈", label: "Relatórios", href: "/admin/relatorios" },
    { id: "configuracoes", icon: "⚙️", label: "Configurações", href: "#" },
  ]

  const handleMenuClick = (item) => {
    if (item.href && item.href !== "#") {
      router.push(item.href)
    } else {
      setActiveMenu(item.id)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "confirmado":
        return "bg-green-100 text-green-800"
      case "enviado":
        return "bg-blue-100 text-blue-800"
      case "entregue":
        return "bg-green-200 text-green-900"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pendente":
        return "Aguardando confirmação"
      case "confirmado":
        return "Pedido confirmado"
      case "enviado":
        return "Produto enviado"
      case "entregue":
        return "Entregue"
      case "cancelado":
        return "Cancelado"
      default:
        return status
    }
  }

  const alterarStatus = async (pedidoId, novoStatus) => {
    try {
      setUpdating(true)

      const pedido = pedidos.find((p) => p.id === pedidoId)
      if (!pedido) return

      const { error } = await supabase
        .from("pedidos")
        .update({
          status: novoStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pedido.pedidoId)

      if (error) throw error

      setPedidos((prev) =>
        prev.map((pedido) => {
          if (pedido.id === pedidoId) {
            const novoHistorico = [
              ...pedido.historico,
              {
                status: novoStatus,
                data: new Date(),
                observacao: `Status alterado para ${getStatusText(novoStatus)}`,
              },
            ]
            return { ...pedido, status: novoStatus, historico: novoHistorico }
          }
          return pedido
        }),
      )

      alert("Status atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao alterar status:", error)
      alert("Erro ao alterar status do pedido")
    } finally {
      setUpdating(false)
    }
  }

  const abrirWhatsApp = (whatsapp) => {
    const numero = whatsapp.replace(/\D/g, "")
    window.open(`https://wa.me/55${numero}`, "_blank")
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    // Filtro por status
    if (filtroStatus !== "todos" && pedido.status !== filtroStatus) return false

    // Filtro por busca
    if (
      busca &&
      !pedido.cliente.toLowerCase().includes(busca.toLowerCase()) &&
      !pedido.id.toLowerCase().includes(busca.toLowerCase())
    )
      return false

    return true
  })

  const estatisticas = {
    total: pedidos.length,
    pendentes: pedidos.filter((p) => p.status === "pendente").length,
    confirmados: pedidos.filter((p) => p.status === "confirmado").length,
    cancelados: pedidos.filter((p) => p.status === "cancelado").length,
    faturamento: pedidos.reduce((acc, p) => acc + p.total, 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <Image src="/gaby-summer-logo.png" alt="GABY SUMMER" width={80} height={80} className="mx-auto" />
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-orange-50 transition-colors ${
                activeMenu === item.id ? "bg-orange-100 border-r-4 border-orange-500 text-orange-700" : "text-gray-700"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-left hover:bg-red-50 text-red-600 transition-colors mt-4"
          >
            <span className="mr-3 text-lg">🚪</span>
            Sair
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pedidos WhatsApp - Controle de Vendas</h1>
          <p className="text-gray-600 capitalize">{currentDate}</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Pedidos</h3>
            <span className="text-2xl font-bold text-gray-900">{estatisticas.total}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pendentes</h3>
            <span className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Confirmados</h3>
            <span className="text-2xl font-bold text-green-600">{estatisticas.confirmados}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Cancelados</h3>
            <span className="text-2xl font-bold text-red-600">{estatisticas.cancelados}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Faturamento</h3>
            <span className="text-2xl font-bold text-orange-600">R$ {estatisticas.faturamento.toFixed(2)}</span>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Filtro Status */}
              <div className="flex gap-2">
                {["todos", "pendente", "confirmado", "cancelado"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtroStatus === status
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "todos" ? "Todos" : getStatusText(status)}
                  </button>
                ))}
              </div>

              {/* Busca */}
              <input
                type="text"
                placeholder="Buscar por cliente ou ID..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Novo Pedido Manual
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Header do Card */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">#{pedido.id}</h3>
                  <p className="text-sm text-gray-600">{pedido.cliente}</p>
                  <p className="text-xs text-gray-500">{pedido.whatsapp}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                  {getStatusText(pedido.status)}
                </span>
              </div>

              {/* Produtos */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Produtos:</h4>
                <div className="space-y-1">
                  {pedido.produtos.map((produto, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {produto.nome} ({produto.tamanho}, {produto.cor})
                      {produto.quantidade > 1 && ` x${produto.quantidade}`}
                    </p>
                  ))}
                </div>
              </div>

              {/* Valor Total */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-orange-600">R$ {pedido.total.toFixed(2)}</span>
              </div>

              {/* Data/Hora */}
              <div className="mb-4">
                <p className="text-xs text-gray-500">
                  {pedido.data.toLocaleDateString("pt-BR")} às{" "}
                  {pedido.data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {/* Observações */}
              {pedido.observacoes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 italic">"{pedido.observacoes}"</p>
                </div>
              )}

              {/* Ações */}
              <div className="flex flex-wrap gap-2">
                {pedido.status === "pendente" && (
                  <button
                    onClick={() => alterarStatus(pedido.id, "confirmado")}
                    disabled={updating}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirmar"}
                  </button>
                )}

                {pedido.status !== "cancelado" && (
                  <button
                    onClick={() => alterarStatus(pedido.id, "cancelado")}
                    disabled={updating}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                )}

                <button
                  onClick={() => abrirWhatsApp(pedido.whatsapp)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </button>

                <button
                  onClick={() => {
                    setPedidoSelecionado(pedido)
                    setShowModal(true)
                  }}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Detalhes */}
        {showModal && pedidoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Detalhes do Pedido #{pedidoSelecionado.id}</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Info do Cliente */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Informações do Cliente</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p>
                      <strong>Nome:</strong> {pedidoSelecionado.cliente}
                    </p>
                    <p>
                      <strong>WhatsApp:</strong> {pedidoSelecionado.whatsapp}
                    </p>
                    <p>
                      <strong>Data do Pedido:</strong> {pedidoSelecionado.data.toLocaleDateString("pt-BR")} às{" "}
                      {pedidoSelecionado.data.toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* Produtos Detalhados */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Produtos</h3>
                  <div className="space-y-3">
                    {pedidoSelecionado.produtos.map((produto, idx) => (
                      <div key={idx} className="flex items-center bg-gray-50 rounded-lg p-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg mr-4"></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                          <p className="text-sm text-gray-600">
                            Tamanho: {produto.tamanho} | Cor: {produto.cor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">R$ {produto.preco.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <p className="text-xl font-bold text-orange-600">Total: R$ {pedidoSelecionado.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Histórico de Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Histórico do Pedido</h3>
                  <div className="space-y-3">
                    {pedidoSelecionado.historico.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(item.status).replace("bg-", "bg-").replace("text-", "bg-").split(" ")[0]}`}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900">{getStatusText(item.status)}</p>
                          <p className="text-sm text-gray-600">{item.observacao}</p>
                          <p className="text-xs text-gray-500">
                            {item.data.toLocaleDateString("pt-BR")} às {item.data.toLocaleTimeString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observações */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Observações Internas</h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Adicionar observação interna..."
                    defaultValue={pedidoSelecionado.observacoes}
                  ></textarea>
                </div>

                {/* Ações do Modal */}
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Imprimir Pedido
                  </button>
                  <button
                    onClick={() => abrirWhatsApp(pedidoSelecionado.whatsapp)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Abrir WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
