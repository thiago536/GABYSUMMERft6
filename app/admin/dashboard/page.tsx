"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState("")
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("gabyAdminAuth")
    if (!isAuth) {
      router.push("/admin")
      return
    }

    const now = new Date()
    setCurrentDate(
      now.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )

    const handleTouchStart = (e) => {
      const touchStartX = e.touches[0].clientX
      const handleTouchEnd = (endEvent) => {
        const touchEndX = endEvent.changedTouches[0].clientX
        const diff = touchStartX - touchEndX

        if (touchStartX < 20 && diff < -50) {
          setIsMobileMenuOpen(true)
        }
        if (isMobileMenuOpen && diff < -50) {
          setIsMobileMenuOpen(false)
        }

        document.removeEventListener("touchend", handleTouchEnd)
      }
      document.addEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchstart", handleTouchStart)
    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
    }
  }, [router, isMobileMenuOpen])

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
    setIsMobileMenuOpen(false)
    if (item.href && item.href !== "#") {
      router.push(item.href)
    } else {
      setActiveMenu(item.id)
    }
  }

  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false)
  }

  const metricsData = [
    { title: "Vendas Hoje", value: "R$ 1.247,50", change: "↑ 12%", color: "text-green-600" },
    { title: "Pedidos", value: "18", change: "↑ 8%", color: "text-green-600" },
    { title: "Produtos", value: "78", change: "→ 0%", color: "text-gray-600" },
    { title: "Visitantes", value: "245", change: "↑ 15%", color: "text-green-600" },
  ]

  const salesData = [
    { day: "Seg", value: 890 },
    { day: "Ter", value: 1200 },
    { day: "Qua", value: 750 },
    { day: "Qui", value: 1400 },
    { day: "Sex", value: 1650 },
    { day: "Sáb", value: 980 },
    { day: "Dom", value: 650 },
  ]

  const topProducts = [
    { name: "Biquíni Sunset Glow", sales: 12 },
    { name: "Top Strappy Power", sales: 8 },
    { name: "Legging High Waist", sales: 6 },
  ]

  const recentOrders = [
    { id: "#001", client: "Maria Silva", value: "R$ 189,90", status: "Confirmado", time: "14:30" },
    { id: "#002", client: "Ana Costa", value: "R$ 245,50", status: "Pendente", time: "13:45" },
    { id: "#003", client: "Julia Santos", value: "R$ 156,00", status: "Confirmado", time: "12:20" },
    { id: "#004", client: "Carla Lima", value: "R$ 298,90", status: "Pendente", time: "11:15" },
    { id: "#005", client: "Beatriz Rocha", value: "R$ 167,50", status: "Confirmado", time: "10:30" },
  ]

  const maxSalesValue = Math.max(...salesData.map((d) => d.value))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-orange-600 h-16 flex items-center justify-between px-4 shadow-lg">
        <Image src="/gaby-summer-logo.png" alt="GABY SUMMER" width={40} height={40} />
        <h1 className="text-white font-bold text-lg">Admin</h1>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white p-2 hover:bg-orange-600 rounded-lg transition-colors"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
            <div className="w-full h-0.5 bg-white"></div>
          </div>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={handleOverlayClick}
        />
      )}

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold">G</span>
            </div>
            <span className="text-white font-semibold">Olá, Gaby! ☀️</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white p-2 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="hidden lg:block p-6 border-b">
          <Image src="/gaby-summer-logo.png" alt="GABY SUMMER" width={80} height={80} className="mx-auto" />
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center px-6 py-4 text-left hover:bg-orange-50 transition-colors ${
                activeMenu === item.id ? "bg-orange-100 border-r-4 border-orange-500 text-orange-700" : "text-gray-700"
              }`}
            >
              <span className="mr-4 text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-4 text-left hover:bg-red-50 text-red-600 transition-colors mt-4"
          >
            <span className="mr-4 text-xl">🚪</span>
            <span className="font-medium">Sair</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 pt-20 lg:pt-8 p-4 lg:p-8">
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Olá, Gaby! ☀️</h1>
          <p className="text-gray-600 capitalize">{currentDate}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {metricsData.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
              <h3 className="text-xs lg:text-sm font-medium text-gray-500 mb-2">{metric.title}</h3>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <span className="text-lg lg:text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className={`text-xs lg:text-sm font-medium ${metric.color} mt-1 lg:mt-0`}>{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6">Vendas da Semana</h3>
            <div className="flex items-end justify-between h-32 lg:h-48 space-x-1 lg:space-x-2">
              {salesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg mb-2 transition-all hover:from-orange-600 hover:to-orange-500"
                    style={{ height: `${(data.value / maxSalesValue) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 font-medium">{data.day}</span>
                  <span className="text-xs text-gray-500 hidden lg:block">R$ {data.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6">Produtos Mais Vendidos</h3>
            <div className="space-y-3 lg:space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <span className="text-sm lg:text-base text-gray-800 font-medium">{product.name}</span>
                  </div>
                  <span className="text-orange-600 font-semibold text-sm lg:text-base">{product.sales}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6">Pedidos Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-500">Cliente</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-500">Valor</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 text-xs lg:text-sm font-medium text-gray-500 hidden lg:table-cell">
                      Horário
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-2 text-xs lg:text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 px-2 text-xs lg:text-sm text-gray-700">{order.client}</td>
                      <td className="py-3 px-2 text-xs lg:text-sm font-semibold text-gray-900">{order.value}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "Confirmado"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs lg:text-sm text-gray-500 hidden lg:table-cell">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 lg:mb-6">Alertas</h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-800">Estoque Baixo</p>
                  <p className="text-xs text-orange-600">3 produtos com estoque baixo</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">⏳</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pedidos Pendentes</p>
                  <p className="text-xs text-yellow-600">5 pedidos aguardando confirmação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => handleMenuClick({ id: "dashboard", href: "/admin/dashboard" })}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeMenu === "dashboard" ? "text-orange-600" : "text-gray-500"
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => handleMenuClick({ id: "produtos", href: "/admin/produtos" })}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeMenu === "produtos" ? "text-orange-600" : "text-gray-500"
            }`}
          >
            <span className="text-lg">👙</span>
            <span className="text-xs font-medium">Produtos</span>
          </button>
          <button
            onClick={() => handleMenuClick({ id: "pedidos", href: "/admin/pedidos" })}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeMenu === "pedidos" ? "text-orange-600" : "text-gray-500"
            }`}
          >
            <span className="text-lg">📱</span>
            <span className="text-xs font-medium">Pedidos</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center space-y-1 text-gray-500"
          >
            <span className="text-lg">⚙️</span>
            <span className="text-xs font-medium">Mais</span>
          </button>
        </div>
      </div>
    </div>
  )
}
