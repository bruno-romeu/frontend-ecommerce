"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResendButton, setShowResendButton] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowResendButton(false)
    setResendMessage(null)

    try {
      await login(email, password)
    } catch (err: any) {
      console.error("Erro no login:", err)
      
      if (err.response?.status === 403) {
        const errorData = err.response.data
        
        if (errorData.email_verified === false) {
          setError("Email não verificado. Por favor, verifique seu email antes de fazer login.")
          setShowResendButton(true)
          
          sessionStorage.setItem('registration_email', email)
        } else {
          setError(errorData.error || "Não foi possível fazer login.")
        }
      } else if (err.response?.status === 401) {
        setError("Email ou senha incorretos.")
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("Ocorreu um erro desconhecido durante o login.")
      }
    }
  }

  const handleResendVerification = async () => {
    setResendLoading(true)
    setResendMessage(null)
    setError(null)

    try {
      await api.post('/client/resend-verification/', { email })
      setResendMessage("✅ Email de verificação reenviado! Verifique sua caixa de entrada.")
      setShowResendButton(false)
    } catch (error: any) {
      if (error.response?.status === 429) {
        setResendMessage("⚠️ Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.")
      } else {
        setResendMessage("❌ Erro ao reenviar email. Tente novamente mais tarde.")
      }
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg border">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Acesse sua conta
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <Label htmlFor="email-address">Email</Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resendMessage && (
              <Alert className={
                resendMessage.includes('✅') 
                  ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800'
                  : resendMessage.includes('⚠️')
                  ? 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800'
                  : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800'
              }>
                <AlertDescription>{resendMessage}</AlertDescription>
              </Alert>
            )}

            {showResendButton && (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Reenviando..." : "Reenviar Email de Verificação"}
                </Button>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </div>
          </form>

          <div className="text-sm text-center space-y-2">
            <p>
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
            <p>
              <Link href="/esqueci-senha" className="font-medium text-primary hover:underline">
                Esqueci minha senha
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}