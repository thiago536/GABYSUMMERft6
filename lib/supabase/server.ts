import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const isValidSupabaseUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    return (
      url.startsWith("https://") &&
      url.includes(".supabase.co") &&
      !url.includes("your-project-id") &&
      !url.includes("seu-projeto")
    )
  } catch {
    return false
  }
}

const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseServiceKey.length > 0 &&
  isValidSupabaseUrl(supabaseUrl) &&
  !supabaseServiceKey.includes("sua_chave")

const createMockSupabaseClient = () => {
  console.log("[v0] Server: Usando mock Supabase client")

  // Use the same mock implementation as the client
  const { supabase: clientMock } = require("./client")
  return clientMock
}

export const createServerClient = () => {
  if (isSupabaseConfigured) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return createMockSupabaseClient()
}
