"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Clock } from "lucide-react"
import api from "@/lib/api"

export default function VerificacaoEnviadaPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registration_email')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleResendEmail = async () => {
    if (!email) {
      setResendMessage("Email não encontrado. Por favor, registre-se novamente.")
      return
    }

    setIsResending(true)
    setResendMessage(null)

    try {
      await api.post('/client/resend-verification/', { email })
      setResendMessage("Email reenviado com sucesso! Verifique sua caixa de entrada.")
      setCanResend(false)
      setCountdown(300) // 5 minutos em segundos
    } catch (error: any) {
      if (error.response?.status === 429) {
        setResendMessage("Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.")
        setCanResend(false)
        setCountdown(300)
      } else {
        setResendMessage("Erro ao reenviar email. Tente novamente mais tarde.")
      }
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verifique seu Email</CardTitle>
          <CardDescription className="text-default font-bold mt-2">
            Enviamos um link de verificação para o seu email
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {email && (
            <div className="text-center">
              <p className="text-default text-default mb-2">Email enviado para:</p>
              <p className="font-semibold text-foreground">{email}</p>
            </div>
          )}

          <div className="space-y-3 text-default text-secondary">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>O link de verificação é válido por 24 horas</p>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Não esqueça de verificar sua pasta de spam ou lixo eletrônico</p>
            </div>
          </div>

          {resendMessage && (
            <div className={`text-black p-3 rounded-md ${
              resendMessage.includes('✅') 
                ? 'bg-green-50 text-black dark:bg-green-900/20 dark:text-white' 
                : resendMessage.includes('⚠️')
                ? 'bg-yellow-50 text-black dark:bg-yellow-900/20 dark:text-white'
                : 'bg-red-50 text-black dark:bg-red-900/20 dark:text-white'
            }`}>
              {resendMessage}
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={isResending || !canResend}
            >
              {isResending ? (
                "Reenviando..."
              ) : !canResend ? (
                `Aguarde ${formatTime(countdown)}`
              ) : (
                "Reenviar Email de Verificação"
              )}
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Voltar para Login
            </Button>
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-xs text-foreground">
              Após verificar seu email, você poderá fazer login na sua conta
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}