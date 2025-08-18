"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, Eye, EyeOff, Sun } from "lucide-react"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberLogin, setRememberLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const usernameInput = document.getElementById("username")
    if (usernameInput) {
      usernameInput.focus()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === "admin" && credentials.password === "gaby2024") {
      const authData = {
        authenticated: true,
        timestamp: Date.now(),
        remember: rememberLogin,
      }

      localStorage.setItem("gabyAdminAuth", JSON.stringify(authData))

      setError("")
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 500)
    } else {
      setError("Credenciais inválidas")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF5722] via-[#FF7043] to-[#FFD600] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sun className="w-10 h-10 text-[#FF5722]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">GABY SUMMER</h1>
          <p className="text-white/80 text-sm">Moda Praia & Fitness</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 mx-4 sm:mx-0">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Painel Administrativo</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                className="pl-10 h-12 text-base"
                placeholder="Usuário"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                className="pl-10 pr-10 h-12 text-base"
                placeholder="Senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberLogin}
                onChange={(e) => setRememberLogin(e.target.checked)}
                className="w-4 h-4 text-[#FF5722] border-gray-300 rounded focus:ring-[#FF5722]"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Lembrar login
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white h-12 text-base font-semibold"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors">
              ← Voltar para a loja
            </a>
          </div>

          {/* Credenciais de teste */}
          <div className="mt-4 text-center text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
            <p>Credenciais: admin / gaby2024</p>
          </div>
        </div>
      </div>
    </div>
  )
}
