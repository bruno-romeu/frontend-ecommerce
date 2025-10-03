import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <main className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div>
              <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">Página não encontrada</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ops! A página que você está procurando não existe ou foi movida. Que tal explorar nossa coleção de velas
                artesanais?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Voltar ao Início</Button>
              </Link>
              <Link href="/produtos">
                <Button variant="outline">Ver Produtos</Button>
              </Link>
            </div>

            <div className="pt-8">
              <img
                src="/luxury-candle-burning-in-elegant-home-setting-with.jpg"
                alt="Vela aromática em ambiente aconchegante"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
