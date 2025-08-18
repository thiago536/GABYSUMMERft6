"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Star,
  Home,
  ChevronRightIcon,
  X,
} from "lucide-react"

const PRODUCTS = [
  {
    id: 1,
    name: "Biquíni Sunset Glow",
    price: 89.9,
    originalPrice: 119.9,
    category: "Moda Praia",
    colors: ["Laranja", "Rosa Coral", "Amarelo"],
    sizes: ["PP", "P", "M", "G", "GG"],
    bgColor: "from-[#FF5722] to-[#FF7043]",
    code: "GS001",
    rating: 4.8,
    reviews: 127,
    stock: 3,
    description:
      "Biquíni exclusivo com proteção UV50+ e tecido de secagem rápida. Design moderno que valoriza todas as curvas, perfeito para dias ensolarados na praia. Acompanha necessaire impermeável de brinde.",
    images: [
      "/biquini-laranja-sunset.png",
      "/biquini-laranja-costas.png",
      "/orange-side-tie-bikini.png",
      "/biquini-laranja-detalhe.png",
    ],
    tip: "Combine com nossa Saída de Praia Kimono para um look completo de verão!",
  },
  // ... outros produtos
]

const RELATED_PRODUCTS = [
  { id: 2, name: "Maiô Fitness Pro", price: 149.9, bgColor: "from-[#03A9F4] to-[#0288D1]" },
  { id: 3, name: "Saída de Praia Kimono", price: 79.9, bgColor: "from-[#FFD600] to-[#FFC107]" },
  { id: 4, name: "Shorts Fitness Wave", price: 69.9, bgColor: "from-[#FF7043] to-[#FF5722]" },
  { id: 5, name: "Top Fitness Ocean", price: 59.9, bgColor: "from-[#03A9F4] to-[#0288D1]" },
]

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Number.parseInt(params.id as string)
  const product = PRODUCTS.find((p) => p.id === productId)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])

  useEffect(() => {
    if (product) {
      // Adicionar aos produtos visualizados recentemente
      const recent = JSON.parse(localStorage.getItem("gaby-summer-recent") || "[]")
      const filtered = recent.filter((p: any) => p.id !== product.id)
      const updated = [product, ...filtered].slice(0, 3)
      localStorage.setItem("gaby-summer-recent", JSON.stringify(updated))
      setRecentlyViewed(updated.slice(1))

      // Definir cor e tamanho padrão
      if (product.colors.length > 0) setSelectedColor(product.colors[0])
      if (product.sizes.length > 0) setSelectedSize(product.sizes[0])
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button onClick={() => router.push("/")} className="bg-[#FF5722] hover:bg-[#E64A19]">
            Voltar à loja
          </Button>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const addToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      selectedColor,
      selectedSize,
      image: product.bgColor,
    }

    const cart = JSON.parse(localStorage.getItem("gaby-summer-cart") || "[]")
    const existingIndex = cart.findIndex(
      (item: any) =>
        item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize,
    )

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem("gaby-summer-cart", JSON.stringify(cart))
    alert("Produto adicionado ao carrinho!")
  }

  const buyNow = () => {
    const message = `🏖️ Olá! Quero comprar:\n👙 ${product.name}\n💰 R$ ${product.price.toFixed(2).replace(".", ",")}\n🎨 Cor: ${selectedColor}\n📏 Tamanho: ${selectedSize}\n📦 Quantidade: ${quantity}`
    window.open(`https://wa.me/5583886357773?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/gaby-summer-logo.png" alt="GABY SUMMER" className="h-10" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-[#FF5722]">GABY SUMMER</h1>
                <p className="text-sm text-gray-600">Moda Praia & Fitness</p>
              </div>
            </div>
            <Button onClick={() => router.push("/")} variant="outline" size="sm">
              Voltar à loja
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <ChevronRightIcon className="w-4 h-4" />
          <span>{product.category}</span>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-[#FF5722] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Gallery - 60% */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[5/6] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Position Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1}/{product.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? "border-[#FF5722]" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info - 40% */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating}) - {product.reviews} avaliações
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-[#FF5722]">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Código: {product.code}</p>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Cor: {selectedColor}</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? "border-[#FF5722] scale-110" : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor:
                          color === "Laranja"
                            ? "#FF5722"
                            : color === "Rosa Coral"
                              ? "#FF7043"
                              : color === "Amarelo"
                                ? "#FFD600"
                                : color === "Azul"
                                  ? "#03A9F4"
                                  : color === "Preto"
                                    ? "#000"
                                    : "#ccc",
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Tamanho: {selectedSize}</h3>
                <div className="flex space-x-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        selectedSize === size
                          ? "bg-[#FF5722] text-white border-[#FF5722]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#FF5722]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Quantidade</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-[#FF5722] text-white flex items-center justify-center hover:bg-[#E64A19] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-[#FF5722] text-white flex items-center justify-center hover:bg-[#E64A19] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.stock <= 5 && (
                  <p className="text-sm text-red-600 mt-2">Apenas {product.stock} unidades restantes!</p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-6">
                <Button onClick={addToCart} className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white py-3">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button onClick={buyNow} className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Comprar Agora
                </Button>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setIsWishlisted(!isWishlisted)} className="flex-1">
                    <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    Favoritar
                  </Button>
                  <Button variant="outline" onClick={() => setShowShareModal(true)} className="flex-1">
                    <Share2 className="w-5 h-5 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>

              {/* Gaby's Tip */}
              <div className="bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-[#FF5722] mb-2">💡 Dica da Gaby:</h4>
                <p className="text-sm text-gray-700">{product.tip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RELATED_PRODUCTS.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className={`aspect-square bg-gradient-to-br ${relatedProduct.bgColor} flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-2xl">{relatedProduct.name.charAt(0)}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{relatedProduct.name}</h3>
                  <p className="text-[#FF5722] font-bold">R$ {relatedProduct.price.toFixed(2).replace(".", ",")}</p>
                  <Button
                    onClick={() => router.push(`/produto/${relatedProduct.id}`)}
                    size="sm"
                    className="w-full mt-3 bg-[#FF5722] hover:bg-[#E64A19]"
                  >
                    Ver Produto
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visto recentemente</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentlyViewed.map((recentProduct) => (
                <div key={recentProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div
                    className={`aspect-square bg-gradient-to-br ${recentProduct.bgColor} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-2xl">{recentProduct.name.charAt(0)}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2">{recentProduct.name}</h3>
                    <p className="text-[#FF5722] font-bold">R$ {recentProduct.price.toFixed(2).replace(".", ",")}</p>
                    <Button
                      onClick={() => router.push(`/produto/${recentProduct.id}`)}
                      size="sm"
                      className="w-full mt-3 bg-[#FF5722] hover:bg-[#E64A19]"
                    >
                      Ver Novamente
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal with Coral Gradient */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#FF7043] to-[#FFCCBC] rounded-lg max-w-md w-full p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Compartilhar Produto 🌊</h3>
              <button onClick={() => setShowShareModal(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 text-center">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-white/90 font-bold">R$ {product.price.toFixed(2).replace(".", ",")}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const message = `🏖️ Olha que produto incrível da GABY SUMMER!\n👙 ${product.name}\n💰 R$ ${product.price.toFixed(2).replace(".", ",")}\n🎨 Disponível em: ${product.colors.join(", ")}\n📏 Tamanhos: ${product.sizes.join(", ")}\n🌊 Ver mais: ${window.location.href}\n\nInstagram: @gab.ysummer`
                  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
                }}
                className="flex items-center justify-center space-x-2 p-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => window.open("https://www.instagram.com/gab.ysummer", "_blank")}
                className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-[#E4405F] to-[#F56040] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <span>📷</span>
                <span>Instagram</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert("Link copiado!")
                }}
                className="flex items-center justify-center space-x-2 p-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>📋</span>
                <span>Copiar Link</span>
              </button>

              <button
                onClick={() => {
                  const subject = `Produto incrível da GABY SUMMER: ${product.name}`
                  const body = `Olha que produto incrível da GABY SUMMER!\n\n${product.name}\nR$ ${product.price.toFixed(2).replace(".", ",")}\n\nVer mais: ${window.location.href}`
                  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
                }}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>📧</span>
                <span>E-mail</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
