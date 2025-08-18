import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

console.log("[v0] URL lida:", supabaseUrl)
console.log("[v0] Anon Key lida:", supabaseAnonKey ? "***configurada***" : "vazia")

const isValidSupabaseUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    // Check if it's a real Supabase URL, not a placeholder
    return (
      url.startsWith("https://") &&
      url.includes(".supabase.co") &&
      !url.includes("your-project-id") && // Detect placeholder
      !url.includes("seu-projeto") // Detect Portuguese placeholder
    )
  } catch {
    return false
  }
}

export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  isValidSupabaseUrl(supabaseUrl) &&
  !supabaseAnonKey.includes("sua_chave") // Detect placeholder key

const mockProducts = [
  {
    id: "1",
    nome: "Biquíni Sunset Paradise",
    categoria: "Moda Praia",
    preco: 89.9,
    descricao: "Biquíni com estampa tropical em tons de laranja e amarelo, perfeito para o verão.",
    cores: ["Laranja Sunset", "Amarelo Solar"],
    tamanhos: ["P", "M", "G"],
    ativo: true,
    imagem_url: "/placeholder.svg?height=400&width=400",
    estoque: 15,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    nome: "Maiô Oceano Azul",
    categoria: "Moda Praia",
    preco: 129.9,
    descricao: "Maiô elegante em azul oceano com detalhes em dourado.",
    cores: ["Azul Oceano"],
    tamanhos: ["PP", "P", "M", "G"],
    ativo: true,
    imagem_url: "/placeholder.svg?height=400&width=400",
    estoque: 8,
    created_at: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    nome: "Top Fitness Coral",
    categoria: "Fitness",
    preco: 59.9,
    descricao: "Top esportivo em coral com suporte médio, ideal para treinos.",
    cores: ["Rosa Coral"],
    tamanhos: ["P", "M", "G", "GG"],
    ativo: true,
    imagem_url: "/placeholder.svg?height=400&width=400",
    estoque: 20,
    created_at: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    nome: "Conjunto Verão Tropical",
    categoria: "Moda Praia",
    preco: 149.9,
    descricao: "Conjunto completo com estampa de folhas tropicais.",
    cores: ["Verde Tropical", "Rosa Flamingo"],
    tamanhos: ["P", "M", "G"],
    ativo: true,
    imagem_url: "/placeholder.svg?height=400&width=400",
    estoque: 12,
    created_at: "2024-01-12T14:20:00Z",
  },
]

const createMockSupabaseClient = () => {
  console.log("[v0] Usando mock Supabase client - dados de exemplo serão exibidos")

  return {
    from: (table: string) => ({
      select: (columns = "*") => {
        const baseQuery = {
          eq: (column: string, value: any) => ({
            order: (orderColumn: string, options?: any) => ({
              then: () => {
                const filtered = mockProducts.filter((p) => (p as any)[column] === value)
                return Promise.resolve({
                  data: filtered,
                  error: null,
                })
              },
            }),
            then: () => {
              const filtered = mockProducts.filter((p) => (p as any)[column] === value)
              return Promise.resolve({
                data: filtered,
                error: null,
              })
            },
          }),
          ilike: (column: string, pattern: string) => ({
            then: () => {
              const searchTerm = pattern.replace(/%/g, "").toLowerCase()
              const filtered = mockProducts.filter((p) => (p as any)[column]?.toLowerCase().includes(searchTerm))
              return Promise.resolve({ data: filtered, error: null })
            },
          }),
          order: (orderColumn: string, options?: any) => ({
            then: () => {
              const sorted = [...mockProducts].sort((a, b) => {
                const aVal = (a as any)[orderColumn]
                const bVal = (b as any)[orderColumn]
                if (options?.ascending === false) {
                  return bVal > aVal ? 1 : -1
                }
                return aVal > bVal ? 1 : -1
              })
              return Promise.resolve({
                data: sorted,
                error: null,
              })
            },
          }),
          single: () =>
            Promise.resolve({
              data: mockProducts[0] || null,
              error: null,
            }),
          then: () =>
            Promise.resolve({
              data: table === "produtos" ? mockProducts : [],
              error: null,
            }),
        }
        return baseQuery
      },
      insert: (data: any) => ({
        select: () => ({
          single: () => {
            const newProduct = {
              id: Date.now().toString(),
              created_at: new Date().toISOString(),
              ...data,
            }
            mockProducts.push(newProduct)
            return Promise.resolve({
              data: newProduct,
              error: null,
            })
          },
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => {
              const index = mockProducts.findIndex((p) => (p as any)[column] === value)
              if (index >= 0) {
                mockProducts[index] = { ...mockProducts[index], ...data }
                return Promise.resolve({
                  data: mockProducts[index],
                  error: null,
                })
              }
              return Promise.resolve({
                data: null,
                error: { message: "Produto não encontrado" },
              })
            },
          }),
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          const index = mockProducts.findIndex((p) => (p as any)[column] === value)
          if (index >= 0) {
            mockProducts.splice(index, 1)
          }
          return Promise.resolve({ error: null })
        },
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) =>
          Promise.resolve({
            data: { path: `mock/${path}` },
            error: null,
          }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `/placeholder.svg?height=400&width=400&query=uploaded+product+image` },
        }),
      }),
    },
  }
}

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : createMockSupabaseClient()

export const getSupabaseClient = () => {
  return supabase
}
