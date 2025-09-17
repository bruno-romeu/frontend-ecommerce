"use client"

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido durante o login.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg border">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
              Acesse sua conta
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
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
              <div className="pt-4">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  className="mt-2"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive mt-4 text-center">{error}</p>}
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </div>
          </form>
          <div className="text-sm text-center">
            <p>
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}