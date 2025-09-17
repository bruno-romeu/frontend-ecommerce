import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Criar Conta</h1>
            <p className="text-muted-foreground">Junte-se à nossa comunidade de amantes de velas artesanais</p>
          </div>
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
