"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function RegisterForm() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    acceptTerms: false,
    newsletter: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido"
    }
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres"
    }
    if (formData.password2 !== formData.password) {
      newErrors.password2 = "As senhas não coincidem"
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos de serviço"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    const nameParts = formData.name.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')

    const payload = {
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
      first_name: firstName,
      last_name: lastName || firstName,
    }

    try {
      // Usa o register do AuthContext que já faz tudo
      await register(payload)
      // O AuthContext já redireciona para /verificacao-enviada
    } catch (error: any) {
      console.error("Erro no formulário de registro:", error)
      
      if (error.response && error.response.data) {
        const backendErrors: Record<string, string> = {}
        for (const key in error.response.data) {
          const errorValue = error.response.data[key]
          if (Array.isArray(errorValue)) {
            backendErrors[key] = errorValue.join(' ')
          } else {
            backendErrors[key] = errorValue
          }
        }
        setErrors(backendErrors)
      } else {
        setErrors({ form: "Ocorreu um erro inesperado. Tente novamente." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="pb-4">
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`h-10 ${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`h-10 ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`h-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="password2" className="text-sm font-medium">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="password2"
                type={showPassword2 ? "text" : "password"}
                placeholder="Digite a senha novamente"
                value={formData.password2}
                onChange={(e) => handleInputChange("password2", e.target.value)}
                className={`h-10 pr-10 ${errors.password2 ? "border-destructive" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 hover:bg-transparent"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password2 && <p className="text-xs text-destructive mt-1">{errors.password2}</p>}
          </div>
          
          <div className="space-y-2 pt-1">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                className={`mt-0.5 ${errors.acceptTerms ? "border-destructive" : ""}`}
              />
              <Label htmlFor="terms" className="text-xs cursor-pointer leading-relaxed">
                Aceito os{" "}
                <Link href="/termos" className="text-primary hover:underline">
                  termos de serviço
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" className="text-primary hover:underline">
                  política de privacidade
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms}</p>}
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="newsletter" className="text-xs cursor-pointer leading-relaxed">
                Quero receber novidades e ofertas exclusivas por e-mail
              </Label>
            </div>
          </div>

          {errors.form && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm rounded-md">
              {errors.form}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
          
          <div className="text-center text-xs text-foreground pt-2">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}