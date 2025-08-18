"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"

const PRODUCTS = [
  // Same products array as main page
  {
    id: 1,
    name: "Biquíni Sunset Glow",
    price: 89.9,
    category: "Moda Praia",
    colors: ["Laranja", "Rosa Coral"],
    sizes: ["PP", "P", "M", "G", "GG"],
    bgColor: "from-[#FF5722] to-[#FF7043]",
  },
  // ... other products
]

export default function FavoritosPage() {
  const [wishlist, setWishlist] = useState<number[]>([])

  useEffect(() => {
    const savedWishlist = localStorage.getItem("gaby-summer-wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  const toggleWishlist = (productId: number) => {
    const newWishlist = wishlist.filter((id) => id !== productId)
    setWishlist(newWishlist)
    localStorage.setItem("gaby-summer-wishlist", JSON.stringify(newWishlist))
  }

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Meus Favoritos ❤️</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum favorito ainda!</h2>
            <p className="text-gray-500 mb-6">Explore nossa coleção ☀️</p>
            <Link href="/">
              <Button className="bg-[#FF5722] hover:bg-[#E64A19] text-white">Explorar Produtos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${product.bgColor} flex items-center justify-center relative`}>
                  <div className="text-white text-6xl font-bold opacity-20">{product.name.charAt(0)}</div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-[#FF5722] mb-4">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-[#FF5722] hover:bg-[#E64A19] text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWishlist(product.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
