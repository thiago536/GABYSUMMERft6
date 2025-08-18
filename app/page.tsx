"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Menu,
  Instagram,
  MapPin,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  X,
  Heart,
  Check,
  Tag,
  User,
} from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  nome: string
  preco: number
  categoria: string
  cores: string[]
  tamanhos: string[]
  descricao: string
  imagem_url: string
  ativo: boolean
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  selectedColor?: string
  selectedSize?: string
}

interface CheckoutData {
  name: string
  whatsapp: string
  email: string
  observations: string
}

interface Coupon {
  code: string
  discount: number
  type: "percentage" | "fixed"
  maxDiscount?: number
  expira: Date
  primeiraCompra?: boolean
}

interface Cliente {
  nome: string
  whatsapp: string
  dataCompra: Date
}

export default function GabySummerHome() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [addedMessage, setAddedMessage] = useState("")
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    name: "",
    whatsapp: "",
    email: "",
    observations: "",
  })
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [validationSuccess, setValidationSuccess] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productColor, setProductColor] = useState("")
  const [productSize, setProductSize] = useState("")
  const [productQuantity, setProductQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [orderSent, setOrderSent] = useState(false)

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponMessage, setCouponMessage] = useState("")
  const [showCouponField, setShowCouponField] = useState(false)
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState(false)

  // Novos estados para funcionalidades extras
  const [darkMode, setDarkMode] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [compareList, setCompareList] = useState<number[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [cepCode, setCepCode] = useState("")
  const [shippingOptions, setShippingOptions] = useState<{ name: string; price: number; days: string }[]>([])
  const [selectedShipping, setSelectedShipping] = useState<{ name: string; price: number; days: string } | null>(null)
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [productRatings, setProductRatings] = useState<{
    [key: number]: { rating: number; comment: string; name: string; date: string }[]
  }>({})
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [ratingFilter, setRatingFilter] = useState("Todas")

  const [showShareModal, setShowShareModal] = useState(false)
  const [shareProduct, setShareProduct] = useState<Product | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem("gaby-summer-cart")
    const savedWishlist = localStorage.getItem("gaby-summer-wishlist")
    const savedCompare = localStorage.getItem("gaby-summer-compare")
    const savedSearchHistory = localStorage.getItem("gaby-summer-search-history")
    const savedDarkMode = localStorage.getItem("gaby-summer-dark-mode")
    const savedNewsletter = localStorage.getItem("gaby-summer-newsletter")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    if (savedCompare) setCompareList(JSON.parse(savedCompare))
    if (savedSearchHistory) setSearchHistory(JSON.parse(savedSearchHistory))
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode))

    // Newsletter popup após 30 segundos se não foi cadastrado
    if (!savedNewsletter) {
      setTimeout(() => setShowNewsletter(true), 30000)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gaby-summer-cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem("gaby-summer-wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem("gaby-summer-compare", JSON.stringify(compareList))
  }, [compareList])

  useEffect(() => {
    localStorage.setItem("gaby-summer-search-history", JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem("gaby-summer-dark-mode", JSON.stringify(darkMode))
  }, [darkMode])

  const shareProductFunc = (product: Product) => {
    setShareProduct(product)
    setShowShareModal(true)
  }

  const shareToWhatsApp = (product: Product) => {
    const message = `🏖️ Olha que produto incrível da GABY SUMMER!
👙 ${product.nome}
💰 R$ ${product.preco.toFixed(2).replace(".", ",")}
🎨 Disponível em: ${product.cores.join(", ")}
📏 Tamanhos: ${product.tamanhos.join(", ")}
🌊 Ver mais: ${window.location.origin}
Instagram: @gab.ysummer`

    window.open(`https://wa.me/558388635773?text=${encodeURIComponent(message)}`, "_blank")
    setShowShareModal(false)
  }

  const shareToInstagram = () => {
    window.open("https://www.instagram.com/gab.ysummer", "_blank")
    setShowShareModal(false)
  }

  const copyProductLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setShowShareModal(false)
  }

  const shareByEmail = (product: Product) => {
    const subject = `Confira este produto da GABY SUMMER: ${product.nome}`
    const body = `Olá! Encontrei este produto incrível da GABY SUMMER e queria compartilhar com você:

${product.nome}
Preço: R$ ${product.preco.toFixed(2).replace(".", ",")}
Cores disponíveis: ${product.cores.join(", ")}
Tamanhos: ${product.tamanhos.join(", ")}

Confira mais produtos em: ${window.location.origin}
Instagram: @gab.ysummer`

    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    setShowShareModal(false)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)

    if (value.length > 0) {
      const suggestions = products
        .filter(
          (p) =>
            p.nome.toLowerCase().includes(value.toLowerCase()) ||
            p.categoria.toLowerCase().includes(value.toLowerCase()) ||
            p.cores.some((c) => c.toLowerCase().includes(value.toLowerCase())),
        )
        .map((p) => p.nome)
        .slice(0, 5)

      setSearchSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion)
    setShowSuggestions(false)

    // Adicionar ao histórico
    if (!searchHistory.includes(suggestion)) {
      setSearchHistory((prev) => [suggestion, ...prev.slice(0, 4)])
    }
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id))

  const addToCart = (product?: Product, color?: string, size?: string, quantity = 1) => {
    if (product) {
      setCart((prev) => {
        const existingItem = prev.find(
          (item) => item.id === product.id && item.selectedColor === color && item.selectedSize === size,
        )
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id && item.selectedColor === color && item.selectedSize === size
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        } else {
          return [
            ...prev,
            {
              id: product.id,
              name: product.nome,
              price: product.preco,
              quantity,
              image: product.imagem_url || `from-[#FF5722] to-[#FF7043]`,
              selectedColor: color,
              selectedSize: size,
            },
          ]
        }
      })
      setAddedMessage("Produto adicionado!")
      setTimeout(() => setAddedMessage(""), 2000)
    }
  }

  const updateQuantity = (id: number, color: string | undefined, size: string | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id, color, size)
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id && item.selectedColor === color && item.selectedSize === size
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      )
    }
  }

  const removeFromCart = (id: number, color: string | undefined, size: string | undefined) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id || item.selectedColor !== color || item.selectedSize !== size),
    )
  }

  const validarPrimeiraCompra = async (whatsapp: string) => {
    try {
      const response = await fetch(`/api/clientes?whatsapp=${encodeURIComponent(whatsapp)}`)
      if (response.ok) {
        const data = await response.json()
        return data.primeiraCompra
      }
    } catch (error) {
      console.error("Erro ao validar primeira compra:", error)
    }
    return true
  }

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage("Digite um código de cupom")
      return
    }

    // Cupom de primeira compra
    if (couponCode.toUpperCase() === "PRIMEIRACOMPRA10") {
      if (!checkoutData.whatsapp) {
        setCouponMessage("Preencha o WhatsApp primeiro")
        return
      }

      validarPrimeiraCompra(checkoutData.whatsapp).then((primeiraCompra) => {
        if (!primeiraCompra) {
          setCouponMessage("WhatsApp já cadastrado. Cupom não aplicável.")
          return
        }

        const cupom: Coupon = {
          code: "PRIMEIRACOMPRA10",
          discount: 10,
          type: "percentage",
          maxDiscount: 50,
          expira: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }

        setAppliedCoupon(cupom)
        setCouponMessage("Cupom aplicado! 10% de desconto (máx. R$ 50)")
        setCouponCode("")
      })
      return
    }

    // Outros cupons podem ser adicionados aqui
    setCouponMessage("Cupom inválido ou expirado")
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponMessage("")
  }

  const handleWhatsAppChange = (value: string) => {
    setCheckoutData((prev) => ({ ...prev, whatsapp: value }))

    if (value.length >= 15) {
      // Formato completo
      validarPrimeiraCompra(value).then((primeiraCompra) => {
        setIsFirstTimeBuyer(primeiraCompra)

        if (primeiraCompra) {
          setCouponMessage("🎉 Primeira compra! Use o cupom PRIMEIRACOMPRA10 para 10% OFF")
        }
      })
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? Math.min(cartTotal * (appliedCoupon.discount / 100), appliedCoupon.maxDiscount || cartTotal)
      : appliedCoupon.discount
    : 0

  const finalTotal = cartTotal - discount + (selectedShipping?.price || 0)

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (checkoutData.name.length < 3) {
      errors.name = "Nome deve ter pelo menos 3 caracteres"
    }

    const whatsappRegex = /^$$\d{2}$$\s\d{4,5}-\d{4}$/
    if (!checkoutData.whatsapp || !whatsappRegex.test(checkoutData.whatsapp)) {
      errors.whatsapp = "Formato: (83) 8863-5773"
    }

    setValidationErrors(errors)

    if (Object.keys(errors).length === 0) {
      setValidationSuccess(true)
      setTimeout(() => setValidationSuccess(false), 3000)
      return true
    }
    return false
  }

  const handleCheckout = () => {
    if (!validateForm()) return

    const clientesAnteriores = JSON.parse(localStorage.getItem("gaby_clientes") || "[]") as Cliente[]
    const novoCliente: Cliente = {
      nome: checkoutData.name,
      whatsapp: checkoutData.whatsapp,
      dataCompra: new Date(),
    }
    clientesAnteriores.push(novoCliente)
    localStorage.setItem("gaby_clientes", JSON.stringify(clientesAnteriores))

    let message = `🏖️ *PEDIDO GABY SUMMER* 🏖️\n\n`
    message += `👤 *Cliente:* ${checkoutData.name}\n`
    message += `📱 *WhatsApp:* ${checkoutData.whatsapp}\n`
    if (checkoutData.email) message += `📧 *E-mail:* ${checkoutData.email}\n`
    message += `\n🛍️ *PRODUTOS:*\n`

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   Cor: ${item.selectedColor}\n`
      message += `   Tamanho: ${item.selectedSize}\n`
      message += `   Qtd: ${item.quantity}x\n`
      message += `   Valor: R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n\n`
    })

    if (appliedCoupon) {
      message += `🎟️ *Cupom:* ${appliedCoupon.code} (-R$ ${discount.toFixed(2).replace(".", ",")})\n`
    }

    if (selectedShipping) {
      message += `🚚 *Frete:* ${selectedShipping.name} - R$ ${selectedShipping.price.toFixed(2).replace(".", ",")} (${selectedShipping.days})\n`
    }

    message += `\n💰 *TOTAL:* R$ ${finalTotal.toFixed(2).replace(".", ",")}\n`

    if (checkoutData.observations) {
      message += `\n📝 *Observações:* ${checkoutData.observations}`
    }

    message += `\n\n🌊 Obrigada por escolher a GABY SUMMER!`

    const whatsappUrl = `https://wa.me/558388635773?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    setCart([])
    setAppliedCoupon(null)
    setOrderSent(true)
    setIsCartOpen(false)
    localStorage.removeItem("gaby-summer-cart")

    setTimeout(() => {
      setOrderSent(false)
    }, 5000)
  }

  const categories = ["Todos", "Moda Praia", "Fitness", "Acessórios"]
  const allColors = [...new Set(products.flatMap((p) => p.cores))]
  const allSizes = [...new Set(products.flatMap((p) => p.tamanhos))]

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "Todos" || product.categoria === selectedCategory
      const matchesPrice = product.preco >= priceRange[0] && product.preco <= priceRange[1]
      const matchesColors = selectedColors.length === 0 || selectedColors.some((color) => product.cores.includes(color))
      const matchesSizes = selectedSizes.length === 0 || selectedSizes.some((size) => product.tamanhos.includes(size))
      const isActive = product.ativo

      return matchesSearch && matchesCategory && matchesPrice && matchesColors && matchesSizes && isActive
    })
  }, [products, searchTerm, selectedCategory, priceRange, selectedColors, selectedSizes])

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const openProductPage = (product: Product) => {
    setSelectedProduct(product)
    setProductColor(product.cores[0])
    setProductSize(product.tamanhos[0])
    setProductQuantity(1)
    setCurrentImageIndex(0)
  }

  const closeProductPage = () => {
    setSelectedProduct(null)
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/produtos")
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center ml-2 md:ml-0">
                <img src="/gaby-summer-logo.png" alt="Gaby Summer" className="h-10 w-auto" />
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setSelectedCategory("Todos")}
                className={`text-sm font-medium transition-colors ${
                  selectedCategory === "Todos" ? "text-orange-600" : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedCategory("Moda Praia")}
                className={`text-sm font-medium transition-colors ${
                  selectedCategory === "Moda Praia" ? "text-orange-600" : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Moda Praia
              </button>
              <button
                onClick={() => setSelectedCategory("Fitness")}
                className={`text-sm font-medium transition-colors ${
                  selectedCategory === "Fitness" ? "text-orange-600" : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Fitness
              </button>
              <button
                onClick={() => setSelectedCategory("Acessórios")}
                className={`text-sm font-medium transition-colors ${
                  selectedCategory === "Acessórios" ? "text-orange-600" : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Acessórios
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/cadastro">
                <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Cadastrar
                </Button>
              </Link>
              <a
                href="https://wa.me/558388635773"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/gab.ysummer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFD600] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-full h-32">
            <svg viewBox="0 0 1200 120" className="w-full h-full">
              <path
                d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
                fill="currentColor"
                className="text-[#FFD600]"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Seu Verão Perfeito
            <br />
            Começa Aqui
          </h2>
          <p className="text-xl text-white/90 mb-8">Descubra nossa coleção exclusiva de moda praia e fitness</p>
          <Button size="lg" className="bg-white text-[#FF5722] hover:bg-gray-100 font-semibold px-8 py-3 text-lg">
            Explorar Coleção
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => (window.location.href = `/produto/${product.id}`)}
              >
                <div
                  className={`h-48 bg-gradient-to-br ${product.imagem_url || "from-[#FF5722] to-[#FF7043]"} flex items-center justify-center`}
                >
                  <div className="text-white text-2xl font-bold">{product.nome.charAt(0)}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.nome}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.categoria}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.cores.slice(0, 3).map((color) => (
                      <Badge key={color} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-600">
                      R$ {product.preco.toFixed(2).replace(".", ",")}
                    </span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProduct(product)
                        setProductColor(product.cores[0])
                        setProductSize(product.tamanhos[0])
                        setProductQuantity(1)
                      }}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum produto encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-[#03A9F4] py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Fique por dentro das novidades</h3>
          <p className="text-white/90 mb-8">Receba em primeira mão nossos lançamentos e promoções exclusivas</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Seu melhor e-mail" className="flex-1 bg-white" />
            <Button className="bg-[#FF5722] hover:bg-[#E64A19] text-white">Inscrever-se</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#E64A19] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-[#FFD600]">GABY SUMMER</h4>
              <p className="text-sm mb-4">Moda Praia & Fitness</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">João Pessoa - Paraíba</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">WhatsApp: (83) 8863-5773</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">📧 contato@gabysummer.com.br</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🕐 Seg-Sex 9h às 18h</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-bold text-lg mb-4">Siga @gab.ysummer</h4>
              <div className="space-y-2">
                <a
                  href="https://www.instagram.com/gab.ysummer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-[#FFD600] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram: @gab.ysummer</span>
                </a>
              </div>
            </div>

            {/* Links Úteis */}
            <div>
              <h4 className="font-bold text-lg mb-4">Links Úteis</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-[#FFD600] transition-colors">
                  • Sobre Nós
                </a>
                <a href="#" className="block hover:text-[#FFD600] transition-colors">
                  • Política de Trocas
                </a>
                <a href="#" className="block hover:text-[#FFD600] transition-colors">
                  • FAQ
                </a>
                <a href="#" className="block hover:text-[#FFD600] transition-colors">
                  • Guia de Tamanhos
                </a>
                <a href="#" className="block hover:text-[#FFD600] transition-colors">
                  • Contato
                </a>
              </div>
            </div>

            {/* Admin Link */}
            <div className="md:text-right">
              <a href="/admin" className="text-xs text-white/30 hover:text-white/50 transition-colors">
                Admin
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/80 text-sm">© 2024 Gaby Summer - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/558388635773?text=Olá! Tenho interesse nos produtos da GABY SUMMER ☀️"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20BA5A] transition-all z-50 animate-pulse"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Share Modal with Coral Gradient */}
      {showShareModal && shareProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#FF7043] to-[#FFCCBC] rounded-lg max-w-md w-full p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Compartilhar Produto 🌊</h3>
              <button onClick={() => setShowShareModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 text-center">
              <h4 className="font-medium">{shareProduct.nome}</h4>
              <p className="text-white/90 font-bold">R$ {shareProduct.preco.toFixed(2).replace(".", ",")}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => shareToWhatsApp(shareProduct)}
                className="flex items-center justify-center space-x-2 p-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={shareToInstagram}
                className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-[#E4405F] to-[#F56040] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <span>📷</span>
                <span>Instagram</span>
              </button>

              <button
                onClick={copyProductLink}
                className="flex items-center justify-center space-x-2 p-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>📋</span>
                <span>Copiar Link</span>
              </button>

              <button
                onClick={() => shareByEmail(shareProduct)}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>📧</span>
                <span>E-mail</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal with Ocean Blue Gradient */}
      {showWishlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#03A9F4] to-[#E1F5FE] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Seus Favoritos ❤️</h2>
                <button onClick={() => setShowWishlist(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💙</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhum favorito ainda</h3>
                  <p className="text-white/80">Adicione produtos aos seus favoritos para vê-los aqui!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div
                        className={`aspect-square bg-gradient-to-br ${product.imagem_url || "from-[#FF5722] to-[#FF7043]"} flex items-center justify-center`}
                      >
                        <span className="text-white font-bold text-2xl">{product.nome.charAt(0)}</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{product.nome}</h3>
                        <p className="text-[#FF5722] font-bold mb-3">R$ {product.preco.toFixed(2).replace(".", ",")}</p>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              setSelectedProduct(product)
                              setShowWishlist(false)
                            }}
                            size="sm"
                            className="flex-1 bg-[#FF5722] hover:bg-[#E64A19]"
                          >
                            Ver Detalhes
                          </Button>
                          <Button
                            onClick={() => toggleWishlist(product.id)}
                            size="sm"
                            variant="outline"
                            className="px-3"
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Sent Notification */}
      {orderSent && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>Pedido enviado! ☀️</span>
        </div>
      )}

      {/* Cart Modal with Orange Gradient */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#FF5722] to-[#FFE0B2] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {cart.length === 0 ? "Seu verão perfeito está a um clique! 🌊" : "Seu Carrinho de Verão ☀️"}
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-white/60 mx-auto mb-4" />
                  <p className="text-white/80">Seu carrinho está vazio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${item.image} rounded-lg flex items-center justify-center`}
                          >
                            <div className="text-white text-xs font-bold">{item.name.charAt(0)}</div>
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.selectedColor} • {item.selectedSize}
                            </p>
                            <p className="text-[#FF5722] font-bold">
                              R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)
                              }
                              className="w-8 h-8 rounded-full bg-[#FF5722] text-white flex items-center justify-center hover:bg-[#E64A19] transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)
                              }
                              className="w-8 h-8 rounded-full bg-[#FF5722] text-white flex items-center justify-center hover:bg-[#E64A19] transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                              className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Subtotal:</span>
                      <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between items-center mb-2 text-green-600">
                        <span className="flex items-center">
                          <Tag className="w-4 h-4 mr-1" />
                          {appliedCoupon.code}
                        </span>
                        <div className="flex items-center">
                          <span>-R$ {discount.toFixed(2).replace(".", ",")}</span>
                          <button onClick={removeCoupon} className="ml-2 text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-[#FF5722]">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>

                    {/* Campo de cupom */}
                    {!appliedCoupon && (
                      <div className="mt-4">
                        {!showCouponField ? (
                          <button
                            onClick={() => setShowCouponField(true)}
                            className="text-[#FF5722] text-sm hover:underline flex items-center"
                          >
                            <Tag className="w-4 h-4 mr-1" />
                            Tenho um cupom de desconto
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Código do cupom"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                              />
                              <button
                                onClick={applyCoupon}
                                className="px-4 py-2 bg-[#FF5722] text-white rounded-lg text-sm hover:bg-[#E64A19]"
                              >
                                Aplicar
                              </button>
                            </div>
                            {couponMessage && (
                              <p
                                className={`text-sm ${couponMessage.includes("aplicado") || couponMessage.includes("🎉") ? "text-green-600" : "text-red-500"}`}
                              >
                                {couponMessage}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-4 text-gray-900">Finalizar Pedido</h3>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Seu nome completo"
                          value={checkoutData.name}
                          onChange={(e) => setCheckoutData((prev) => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg ${validationErrors.name ? "border-red-500" : "border-gray-300"}`}
                        />
                        {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="WhatsApp: (83) 8863-5773"
                          value={checkoutData.whatsapp}
                          onChange={(e) => handleWhatsAppChange(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg ${validationErrors.whatsapp ? "border-red-500" : "border-gray-300"}`}
                        />
                        {validationErrors.whatsapp && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.whatsapp}</p>
                        )}
                        {isFirstTimeBuyer && (
                          <p className="text-green-600 text-sm mt-1">
                            🎉 Primeira compra! Use PRIMEIRACOMPRA10 para 10% OFF
                          </p>
                        )}
                      </div>

                      <input
                        type="email"
                        placeholder="E-mail (opcional)"
                        value={checkoutData.email}
                        onChange={(e) => setCheckoutData((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />

                      <textarea
                        placeholder="Observações (opcional)"
                        value={checkoutData.observations}
                        onChange={(e) => setCheckoutData((prev) => ({ ...prev, observations: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 resize-none"
                      />
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Finalizar Pedido via WhatsApp
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Modal with Yellow Gradient */}
      {showNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#FFD600] to-[#FFF9C4] rounded-lg max-w-md w-full p-6 relative overflow-hidden">
            {/* Decorative waves */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF5722] to-[#FF7043] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#03A9F4] to-[#FF7043] opacity-20"></div>

            <div className="text-center relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Novidades GABY SUMMER ☀️</h3>
              <p className="text-gray-700 mb-6">Receba 10% OFF na primeira compra + novidades exclusivas!</p>

              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="border-[#FF5722] focus:border-[#FF5722] focus:ring-[#FF5722]"
                />

                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      if (newsletterEmail) {
                        localStorage.setItem("gaby-summer-newsletter", "true")
                        setShowNewsletter(false)
                        setNewsletterEmail("")
                      }
                    }}
                    className="flex-1 bg-[#FF5722] hover:bg-[#E64A19] text-white"
                  >
                    Quero 10% OFF!
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewsletter(false)}
                    className="flex-1 border-gray-400 text-gray-700 hover:bg-gray-50"
                  >
                    Agora não
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
