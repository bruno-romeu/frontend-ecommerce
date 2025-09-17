import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/luxury-candle-burning-in-elegant-home-setting-with.jpg"
          alt="Vela aromática em ambiente aconchegante"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">Aconchego que ilumina o seu lar</h1>
        <p className="text-lg md:text-xl mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
          Descubra nossa coleção de velas artesanais e produtos aromáticos que transformam qualquer ambiente em um
          refúgio de bem-estar e elegância.
        </p>
        <Link href="/produtos">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg"
          >
            Comprar Agora
          </Button>
        </Link>
      </div>
    </section>
  )
}
