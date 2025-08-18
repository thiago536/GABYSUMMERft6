"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Filter,
  Grid,
  List,
  Package,
  ShoppingBag,
  Tag,
  Palette,
} from "lucide-react"

// --- Constantes e Tipos ---
const categories = ["Moda Praia", "Fitness", "Acessórios", "Casual", "Esportivo"]
const colors = [
  { name: "Laranja Sunset", value: "#FF5722" },
  { name: "Amarelo Solar", value: "#FFD600" },
  { name: "Azul Oceano", value: "#03A9F4" },
  { name: "Rosa Coral", value: "#FF7043" },
  { name: "Verde Tropical", value: "#4CAF50" },
  { name: "Branco Areia", value: "#FAFAFA" },
  { name: "Preto Elegante", value: "#212121" },
  { name: "Roxo Místico", value: "#9C27B0" },
  { name: "Turquesa", value: "#00BCD4" },
]
const sizes = ["PP", "P", "M", "G", "GG", "XGG", "Único"]

interface Product {
  id: string
  nome: string
  categoria: string
  preco: number
  descricao: string
  cores: string[]
  tamanhos: string[]
  ativo: boolean
  imagem_url: string
  estoque?: number
  custo?: number
  promocao?: {
    ativo: boolean
    desconto: number
    dataInicio?: string
    dataFim?: string
  }
  cupons?: string[]
}

// --- Componente Principal ---
export default function AdminProducts() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()

  // --- Estado do Formulário ---
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    description: "",
    selectedColors: [] as string[],
    selectedSizes: [] as string[],
    ativo: true,
    stock: "10",
    promotion: {
      active: false,
      discount: "",
      startDate: "",
      endDate: "",
    },
    coupons: [] as string[],
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // --- Efeitos ---
  useEffect(() => {
    const isAuth = localStorage.getItem("gabyAdminAuth")
    if (!isAuth) {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
    loadProducts()
  }, [router])

  // Efeito para limpar notificação após um tempo
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // --- Funções de Notificação e Validação ---
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    if (!formData.name || formData.name.length < 3) errors.name = "Nome é obrigatório (mín. 3 caracteres)."
    if (!formData.price || isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0)
      errors.price = "Preço é obrigatório e deve ser um número positivo."
    if (formData.cost && (isNaN(Number.parseFloat(formData.cost)) || Number.parseFloat(formData.cost) < 0))
      errors.cost = "Custo deve ser um número positivo."
    if (!formData.category) errors.category = "Selecione uma categoria."
    if (formData.selectedColors.length === 0) errors.selectedColors = "Selecione pelo menos uma cor."
    if (formData.selectedSizes.length === 0) errors.selectedSizes = "Selecione pelo menos um tamanho."
    if (!editingProduct && !imageFile) errors.image = "A imagem do produto é obrigatória."
    if (formData.promotion.active) {
      if (
        !formData.promotion.discount ||
        isNaN(Number.parseFloat(formData.promotion.discount)) ||
        Number.parseFloat(formData.promotion.discount) <= 0 ||
        Number.parseFloat(formData.promotion.discount) > 100
      ) {
        errors.promotionDiscount = "Desconto deve ser entre 1% e 100%."
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // --- Funções de Dados (API) ---
  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/produtos")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      showNotification("Erro ao carregar produtos. Tente novamente.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProduct = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      let imageUrl = editingProduct?.imagem_url || ""

      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("file", imageFile)

        const uploadResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: imageFormData,
        })

        const uploadResult = await uploadResponse.json()
        if (!uploadResponse.ok || uploadResult.error) {
          throw new Error(uploadResult.error || "Falha no upload da imagem.")
        }
        imageUrl = uploadResult.url
      }

      const productData = {
        nome: formData.name,
        categoria: formData.category,
        preco: Number.parseFloat(formData.price),
        custo: formData.cost ? Number.parseFloat(formData.cost) : undefined,
        descricao: formData.description,
        cores: formData.selectedColors,
        tamanhos: formData.selectedSizes,
        ativo: formData.ativo,
        imagem_url: imageUrl,
        estoque: Number.parseInt(formData.stock) || 10,
        promocao: formData.promotion.active
          ? {
              ativo: true,
              desconto: Number.parseFloat(formData.promotion.discount),
              dataInicio: formData.promotion.startDate,
              dataFim: formData.promotion.endDate,
            }
          : { ativo: false, desconto: 0 },
        cupons: formData.coupons,
      }

      const method = editingProduct ? "PUT" : "POST"
      const url = editingProduct ? `/api/produtos/${editingProduct.id}` : "/api/produtos"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const result = await response.json()
      if (result.error) throw new Error(result.error)

      setIsModalOpen(false)
      showNotification("Produto salvo com sucesso! ✅", "success")
      await loadProducts()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      showNotification(`Erro ao salvar produto: ${error instanceof Error ? error.message : String(error)}`, "error")
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteConfirm(true)
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      const response = await fetch(`/api/produtos/${productToDelete.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const result = await response.json()
      if (result.error) throw new Error(result.error)

      showNotification("Produto excluído com sucesso!", "success")
      await loadProducts()
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      showNotification("Erro ao excluir produto.", "error")
    } finally {
      setShowDeleteConfirm(false)
      setProductToDelete(null)
    }
  }

  // --- Handlers de Interação ---
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterProducts(term, categoryFilter)
  }

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category)
    filterProducts(searchTerm, category)
  }

  const filterProducts = (search: string, category: string) => {
    let filtered = products
    if (search) {
      filtered = filtered.filter((product) => product.nome.toLowerCase().includes(search.toLowerCase()))
    }
    if (category !== "Todos") {
      filtered = filtered.filter((product) => product.categoria === category)
    }
    setFilteredProducts(filtered)
  }

  const handleNewProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      category: "",
      price: "",
      cost: "",
      description: "",
      selectedColors: [],
      selectedSizes: [],
      ativo: true,
      stock: "10",
      promotion: { active: false, discount: "", startDate: "", endDate: "" },
      coupons: [],
    })
    setImageFile(null)
    setImagePreview(null)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.nome,
      category: product.categoria,
      price: product.preco.toString(),
      cost: product.custo?.toString() || "",
      description: product.descricao || "",
      selectedColors: product.cores || [],
      selectedSizes: product.tamanhos || [],
      ativo: product.ativo,
      stock: product.estoque?.toString() || "10",
      promotion: {
        active: product.promocao?.ativo || false,
        discount: product.promocao?.desconto?.toString() || "",
        startDate: product.promocao?.dataInicio || "",
        endDate: product.promocao?.dataFim || "",
      },
      coupons: product.cupons || [],
    })
    setImageFile(null)
    setImagePreview(product.imagem_url)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const getStatusBadge = (ativo: boolean) => {
    return ativo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Produtos</h1>
              <p className="text-sm text-gray-600">Gerencie sua coleção</p>
            </div>
            <Button onClick={handleNewProduct} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Novo Produto</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="px-3">
              <Filter className="w-4 h-4" />
            </Button>
            <div className="hidden sm:flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Categoria</Label>
                  <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todas</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setCategoryFilter("Todos")
                      setFilteredProducts(products)
                    }}
                    className="w-full"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-4">Comece adicionando seu primeiro produto</p>
            <Button onClick={handleNewProduct} className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {viewMode === "grid" ? (
                    <div>
                      <div className="aspect-square relative">
                        <img
                          src={product.imagem_url || "/placeholder.svg?height=200&width=200&query=produto"}
                          alt={product.nome}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge className={getStatusBadge(product.ativo)}>{product.ativo ? "Ativo" : "Inativo"}</Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.nome}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.categoria}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-green-600">R$ {product.preco.toFixed(2)}</span>
                          {product.promocao?.ativo && (
                            <Badge className="bg-red-100 text-red-800">-{product.promocao.desconto}%</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDeleteProduct(product)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex p-4 gap-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={product.imagem_url || "/placeholder.svg?height=80&width=80&query=produto"}
                          alt={product.nome}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">{product.nome}</h3>
                            <p className="text-sm text-gray-600">{product.categoria}</p>
                          </div>
                          <Badge className={getStatusBadge(product.ativo)}>{product.ativo ? "Ativo" : "Inativo"}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">R$ {product.preco.toFixed(2)}</span>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => confirmDeleteProduct(product)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {notification && (
        <div
          className={`fixed top-20 left-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-3" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-3" />
          )}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Label htmlFor="image-upload" className="font-semibold">
                Imagem do Produto *
              </Label>
              <div
                className="mt-2 aspect-square border-2 border-dashed rounded-lg flex items-center justify-center flex-col text-gray-500 hover:border-orange-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview do produto"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm">Clique para fazer upload</p>
                    <p className="text-xs">PNG, JPG, WEBP até 5MB</p>
                  </div>
                )}
              </div>
              <Input
                id="image-upload"
                type="file"
                className="sr-only"
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/webp"
              />
              {formErrors.image && <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>}
            </div>

            <div className="md:col-span-2 space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do produto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Biquíni Sunset"
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                  </div>
                  <div>
                    <Label htmlFor="price">Preço de Venda (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                    {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cost">Custo do Produto (R$)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="0.00"
                    />
                    {formErrors.cost && <p className="text-red-500 text-sm mt-1">{formErrors.cost}</p>}
                  </div>
                  <div>
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                  <div className="flex items-end pb-2 space-x-2">
                    <Checkbox
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData({ ...formData, ativo: !!checked })}
                    />
                    <Label htmlFor="ativo">Produto ativo</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o produto..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Promoções */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Promoções
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="promotion"
                    checked={formData.promotion.active}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        promotion: { ...formData.promotion, active: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="promotion">Produto em promoção</Label>
                </div>
                {formData.promotion.active && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg">
                    <div>
                      <Label htmlFor="discount">Desconto (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.promotion.discount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promotion: { ...formData.promotion, discount: e.target.value },
                          })
                        }
                        placeholder="10"
                      />
                      {formErrors.promotionDiscount && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.promotionDiscount}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="startDate">Data de Início</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.promotion.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promotion: { ...formData.promotion, startDate: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Data de Fim</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.promotion.endDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            promotion: { ...formData.promotion, endDate: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cores e Tamanhos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Variações
                </h3>
                <div>
                  <Label>Cores Disponíveis *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {colors.map((color) => (
                      <div key={color.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color.value}`}
                          checked={formData.selectedColors.includes(color.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selectedColors: [...formData.selectedColors, color.value],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                selectedColors: formData.selectedColors.filter((c) => c !== color.value),
                              })
                            }
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.value }}
                        />
                        <Label htmlFor={`color-${color.value}`} className="text-sm">
                          {color.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formErrors.selectedColors && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.selectedColors}</p>
                  )}
                </div>

                <div>
                  <Label>Tamanhos *</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {sizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={formData.selectedSizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                selectedSizes: [...formData.selectedSizes, size],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                selectedSizes: formData.selectedSizes.filter((s) => s !== size),
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`size-${size}`} className="text-sm font-medium">
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formErrors.selectedSizes && <p className="text-red-500 text-sm mt-1">{formErrors.selectedSizes}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t mt-6">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
              className="order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={saving}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white order-1 sm:order-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Salvar Produto
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
