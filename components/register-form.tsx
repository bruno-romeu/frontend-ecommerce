"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext"; 
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos de serviço";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Lógica do handleSubmit limpa e correta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const payload = {
      email: formData.email,
      password: formData.password,
      first_name: firstName,
      last_name: lastName || firstName, // Garante que o sobrenome não seja vazio
    };

    try {
      // Chama a função de registo centralizada do AuthContext
      await register(payload);
      // O redirecionamento e o alerta de sucesso já são tratados dentro da função register no AuthContext

    } catch (error: any) {
      console.error("Erro no formulário de registo:", error);
      if (error.response && error.response.data) {
        const backendErrors: Record<string, string> = {};
        for (const key in error.response.data) {
          const errorValue = error.response.data[key];
          if (Array.isArray(errorValue)) {
            backendErrors[key] = errorValue.join(' ');
          } else {
            backendErrors[key] = errorValue;
          }
        }
        setErrors(backendErrors);
      } else {
        setErrors({ form: "Ocorreu um erro inesperado. Tente novamente." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <Card>

      <CardHeader className="space-y-1">

      </CardHeader>

      <CardContent>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1">

            <Label htmlFor="name">Nome Completo</Label>

            <Input

              id="name"

              placeholder="Seu nome completo"

              value={formData.name}

              onChange={(e) => handleInputChange("name", e.target.value)}

              className={errors.name ? "border-destructive" : ""}

            />

            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}

          </div>

          <div className="space-y-1">

            <Label htmlFor="email">E-mail</Label>

            <Input

              id="email"

              type="email"

              placeholder="seu@email.com"

              value={formData.email}

              onChange={(e) => handleInputChange("email", e.target.value)}

              className={errors.email ? "border-destructive" : ""}

            />

            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}

          </div>

          <div className="space-y-1">

            <Label htmlFor="password">Senha</Label>

            <div className="relative">

              <Input

                id="password"

                type={showPassword ? "text" : "password"}

                placeholder="Mínimo 6 caracteres"

                value={formData.password}

                onChange={(e) => handleInputChange("password", e.target.value)}

                className={errors.password ? "border-destructive" : ""}

              />

              <Button

                type="button"

                variant="ghost"

                size="icon"

                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"

                onClick={() => setShowPassword(!showPassword)}

              >

                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}

              </Button>

            </div>

            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}

          </div>

          <div className="space-y-1">

            <Label htmlFor="confirmPassword">Confirmar Senha</Label>

            <div className="relative">

              <Input

                id="confirmPassword"

                type={showConfirmPassword ? "text" : "password"}

                placeholder="Digite a senha novamente"

                value={formData.confirmPassword}

                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}

                className={errors.confirmPassword ? "border-destructive" : ""}

              />

              <Button

                type="button"

                variant="ghost"

                size="icon"

                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"

                onClick={() => setShowConfirmPassword(!showConfirmPassword)}

              >

                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}

              </Button>

            </div>

            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}

          </div>

          <div className="space-y-1">

            <div className="flex items-start space-x-2">

              <Checkbox

                id="terms"

                checked={formData.acceptTerms}

                onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}

                className={errors.acceptTerms ? "border-destructive" : ""}

              />

              <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">

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

            {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}

            <div className="flex items-start space-x-2">

              <Checkbox

                id="newsletter"

                checked={formData.newsletter}

                onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}

              />

              <Label htmlFor="newsletter" className="text-sm cursor-pointer leading-relaxed">

                Quero receber novidades e ofertas exclusivas por e-mail

              </Label>

            </div>

          </div>

          <Button

            type="submit"

            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"

            disabled={isLoading}

          >

            {isLoading ? "Criando conta..." : "Criar Conta"}

          </Button>

          <div className="text-center text-sm text-muted-foreground">

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