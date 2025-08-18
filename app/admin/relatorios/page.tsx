"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminRelatorios() {
  const [currentDate, setCurrentDate] = useState("")
  const [activeMenu, setActiveMenu] = useState("relatorios")
  const [selectedPeriod, setSelectedPeriod] = useState("30")
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
  }, [router])

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

  const handleExportReport = () => {
    alert("Relatório exportado com sucesso! 📄")
  }

  // Métricas principais
  const mainMetrics = [
    { title: "Faturamento Total", value: "R$ 12.456,80", change: "↑ 18%", color: "text-green-600" },
    { title: "Pedidos Realizados", value: "89", change: "↑ 12%", color: "text-green-600" },
    { title: "Ticket Médio", value: "R$ 139,96", change: "↑ 5%", color: "text-green-600" },
    { title: "Taxa de Conversão", value: "3.2%", change: "→ 0%", color: "text-gray-600" },
  ]

  // Dados de vendas por dia (últimos 30 dias)
  const dailySalesData = [
    { day: 1, value: 450 },
    { day: 2, value: 320 },
    { day: 3, value: 680 },
    { day: 4, value: 520 },
    { day: 5, value: 780 },
    { day: 6, value: 890 },
    { day: 7, value: 650 },
    { day: 8, value: 420 },
    { day: 9, value: 380 },
    { day: 10, value: 720 },
    { day: 11, value: 560 },
    { day: 12, value: 800 },
    { day: 13, value: 750 },
    { day: 14, value: 620 },
    { day: 15, value: 480 },
    { day: 16, value: 340 },
    { day: 17, value: 590 },
    { day: 18, value: 710 },
    { day: 19, value: 830 },
    { day: 20, value: 690 },
    { day: 21, value: 520 },
    { day: 22, value: 460 },
    { day: 23, value: 780 },
    { day: 24, value: 650 },
    { day: 25, value: 720 },
    { day: 26, value: 580 },
    { day: 27, value: 640 },
    { day: 28, value: 750 },
    { day: 29, value: 680 },
    { day: 30, value: 590 },
  ]

  // Produtos mais vendidos
  const topProducts = [
    { name: "Biquíni Sunset Glow", sales: 23, revenue: "R$ 2.067,70" },
    { name: "Top Strappy Power", sales: 18, revenue: "R$ 1.078,20" },
    { name: "Legging High Waist", sales: 15, revenue: "R$ 1.348,50" },
    { name: "Maiô Fitness Pro", sales: 12, revenue: "R$ 1.798,80" },
    { name: "Shorts Biker", sales: 11, revenue: "R$ 603,90" },
    { name: "Biquíni Tropical", sales: 10, revenue: "R$ 890,00" },
    { name: "Top Cruzado", sales: 9, revenue: "R$ 540,90" },
    { name: "Calça Flare", sales: 8, revenue: "R$ 720,00" },
    { name: "Maiô Decote", sales: 7, revenue: "R$ 1.043,00" },
    { name: "Short Cintura Alta", sales: 6, revenue: "R$ 359,40" },
  ]

  // Horários de pico
  const peakHours = [
    { hour: "9h", percentage: 5 },
    { hour: "10h", percentage: 8 },
    { hour: "11h", percentage: 12 },
    { hour: "12h", percentage: 15 },
    { hour: "13h", percentage: 18 },
    { hour: "14h", percentage: 22 },
    { hour: "15h", percentage: 25 },
    { hour: "16h", percentage: 20 },
    { hour: "17h", percentage: 15 },
    { hour: "18h", percentage: 10 },
    { hour: "19h", percentage: 8 },
    { hour: "20h", percentage: 5 },
  ]

  // Cidades que mais compram
  const topCities = [
    { city: "João Pessoa - PB", percentage: 35 },
    { city: "Recife - PE", percentage: 18 },
    { city: "Fortaleza - CE", percentage: 12 },
    { city: "Salvador - BA", percentage: 10 },
    { city: "Natal - RN", percentage: 8 },
    { city: "Outras", percentage: 17 },
  ]

  // Metas do mês
  const monthlyGoals = [
    { title: "Faturamento", target: 15000, current: 12456.8, unit: "R$" },
    { title: "Pedidos", target: 120, current: 89, unit: "" },
    { title: "Novos clientes", target: 50, current: 45, unit: "" },
  ]

  const maxDailySales = Math.max(...dailySalesData.map((d) => d.value))
  const maxPeakHour = Math.max(...peakHours.map((h) => h.percentage))

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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Relatórios e Analytics - GABY SUMMER</h1>
            <p className="text-gray-600 capitalize">{currentDate}</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Seletor de período */}
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
              {["1", "7", "30", "90"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedPeriod === period ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {period === "1" ? "Hoje" : `${period} dias`}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportReport}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Exportar Relatório
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{metric.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className={`text-sm font-medium ${metric.color}`}>{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico de Vendas por Dia */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Vendas por Dia - Últimos 30 dias</h3>
          <div className="relative h-64">
            <svg className="w-full h-full">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#f3f4f6" strokeWidth="1" />
              ))}

              {/* Sales line */}
              <polyline
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                points={dailySalesData
                  .map(
                    (data, index) =>
                      `${(index / (dailySalesData.length - 1)) * 100},${100 - (data.value / maxDailySales) * 100}`,
                  )
                  .join(" ")}
              />

              {/* Data points */}
              {dailySalesData.map((data, index) => (
                <circle
                  key={index}
                  cx={`${(index / (dailySalesData.length - 1)) * 100}%`}
                  cy={`${100 - (data.value / maxDailySales) * 100}%`}
                  r="4"
                  fill="#f97316"
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>
                    Dia {data.day}: R$ {data.value}
                  </title>
                </circle>
              ))}
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Produtos Mais Vendidos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Top 10 Produtos Mais Vendidos</h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium block">{product.name}</span>
                      <span className="text-sm text-gray-500">{product.sales} vendas</span>
                    </div>
                  </div>
                  <span className="text-orange-600 font-semibold">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vendas por Categoria */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Vendas por Categoria</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                {/* Gráfico de pizza simulado com divs */}
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                  style={{ clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 45%, 50% 50%)" }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                  style={{ clipPath: "polygon(50% 50%, 100% 45%, 100% 100%, 85% 100%, 50% 50%)" }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  style={{ clipPath: "polygon(50% 50%, 85% 100%, 0% 100%, 0% 0%, 50% 0%, 50% 50%)" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-700">100%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                  <span className="text-gray-700">Moda Praia</span>
                </div>
                <span className="font-semibold text-gray-900">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                  <span className="text-gray-700">Fitness</span>
                </div>
                <span className="font-semibold text-gray-900">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-gray-700">Acessórios</span>
                </div>
                <span className="font-semibold text-gray-900">20%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Horários de Pico */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Horários de Pico</h3>
            <div className="space-y-3">
              {peakHours.map((hour, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-8 text-sm text-gray-600 font-medium">{hour.hour}</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(hour.percentage / maxPeakHour) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">{hour.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Origem do Tráfego e Dispositivos */}
          <div className="space-y-6">
            {/* Origem do Tráfego */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Origem do Tráfego</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-pink-500 rounded mr-3"></div>
                    <span className="text-gray-700">Instagram</span>
                  </div>
                  <span className="font-semibold text-gray-900">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-gray-700">Google</span>
                  </div>
                  <span className="font-semibold text-gray-900">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-gray-700">Direto</span>
                  </div>
                  <span className="font-semibold text-gray-900">25%</span>
                </div>
              </div>
            </div>

            {/* Dispositivos */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dispositivos</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                    <span className="text-gray-700">Mobile</span>
                  </div>
                  <span className="font-semibold text-gray-900">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    <span className="text-gray-700">Desktop</span>
                  </div>
                  <span className="font-semibold text-gray-900">22%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cidades que Mais Compram */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Cidades que Mais Compram</h3>
            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 font-medium">{city.city}</span>
                  </div>
                  <span className="text-orange-600 font-semibold">{city.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas e Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Alertas e Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                <span className="text-2xl">🌟</span>
                <div>
                  <p className="text-sm font-medium text-orange-800">Biquíni Sunset Glow é seu produto estrela!</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">Vendas mobile cresceram 25% este mês</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Horário 14h-17h concentra quase metade das vendas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-pink-50 rounded-lg">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="text-sm font-medium text-pink-800">Instagram é sua principal fonte de clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metas do Mês */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Metas do Mês</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {monthlyGoals.map((goal, index) => {
              const percentage = (goal.current / goal.target) * 100
              return (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{goal.title}</span>
                    <span className="text-sm text-gray-500">{Math.round(percentage)}% atingido</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {goal.unit}
                      {goal.current.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-gray-500">
                      Meta: {goal.unit}
                      {goal.target.toLocaleString("pt-BR")}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
