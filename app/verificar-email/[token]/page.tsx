// app/verificar-email/[token]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react"
import api from "@/lib/api"

export default function VerificarEmailPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [status, setStatus] = useState<'verificando' | 'sucesso' | 'erro' | 'expirado'>('verificando')
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (token) {
      verificarEmail(token)
    }
  }, [token])

  useEffect(() => {
    if (status === 'sucesso' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (status === 'sucesso' && countdown === 0) {
      router.push('/login')
    }
  }, [status, countdown, router])

  const verificarEmail = async (token: string) => {
    try {
      const response = await api.post('/client/verify-email/', { token })
      
      if (response.status === 200) {
        setStatus('sucesso')
      }
    } catch (error: any) {
      console.error("Erro ao verificar email:", error)
      
      if (error.response?.data?.expired) {
        setStatus('expirado')
        setErrorMessage("O link de verificação expirou. Por favor, solicite um novo email de verificação.")
      } else if (error.response?.data?.error) {
        setStatus('erro')
        setErrorMessage(error.response.data.error)
      } else {
        setStatus('erro')
        setErrorMessage("Link de verificação inválido ou já utilizado.")
      }
    }
  }

  const handleResendEmail = async () => {
    // Recupera o email do sessionStorage se disponível
    const email = sessionStorage.getItem('registration_email')
    
    if (email) {
      try {
        await api.post('/client/resend-verification/', { email })
        router.push('/verificacao-enviada')
      } catch (error) {
        console.error("Erro ao reenviar email:", error)
        alert("Não foi possível reenviar o email. Tente novamente mais tarde.")
      }
    } else {
      // Se não tiver email no sessionStorage, redireciona para cadastro
      router.push('/cadastro')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {status === 'verificando' && (
              <div className="bg-primary/10">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            {status === 'sucesso' && (
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {(status === 'erro' || status === 'expirado') && (
              <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>

          <CardTitle className="text-2xl text-default font-bold">
            {status === 'verificando' && "Verificando Email..."}
            {status === 'sucesso' && "Email Verificado!"}
            {status === 'expirado' && "Link Expirado"}
            {status === 'erro' && "Erro na Verificação"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === 'verificando' && (
            <div className="text-center">
              <p className="text-foreground">
                Aguarde enquanto verificamos seu email...
              </p>
            </div>
          )}

          {status === 'sucesso' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-foreground font-medium">
                  Seu email foi verificado com sucesso!
                </p>
                <p className="text-sm text-foreground">
                  Você já pode fazer login na sua conta.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                <Clock className="h-4 w-4" />
                <p>Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}...</p>
              </div>

              <Button
                className="w-full"
                onClick={() => router.push('/login')}
              >
                Ir para Login Agora
              </Button>
            </div>
          )}

          {status === 'expirado' && (
            <div className="space-y-4">
              <p className="text-center text-foreground text-sm">
                {errorMessage}
              </p>
              
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleResendEmail}
                >
                  Reenviar Email de Verificação
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/cadastro')}
                >
                  Criar Nova Conta
                </Button>
              </div>
            </div>
          )}

          {status === 'erro' && (
            <div className="space-y-4">
              <p className="text-center text-foreground text-sm">
                {errorMessage || "Ocorreu um erro ao verificar seu email. O link pode ser inválido ou já ter sido utilizado."}
              </p>
              
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => router.push('/cadastro')}
                >
                  Criar Nova Conta
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/login')}
                >
                  Voltar para Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}