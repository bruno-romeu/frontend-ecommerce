import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">

              <span className="font-serif text-xl font-semibold">BALM</span>
            </div>
            <p className="text-sm leading-relaxed">
              Velas artesanais e produtos aromáticos que transformam seu lar em um refúgio de aconchego e bem-estar.
            </p>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Links Úteis</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/sobre" className="text-sm hover:text-primary transition-colors">
                Sobre Nós
              </Link>
              <Link href="/essencias" className="text-sm hover:text-primary transition-colors">
                Nossas Essências
              </Link>
              <Link href="/contato" className="text-sm hover:text-primary transition-colors">
                Contato
              </Link>
              <Link href="/faq" className="text-sm hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/termos" className="text-sm hover:text-primary transition-colors">
                Termos de Serviço
              </Link>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Siga-nos</h3>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Newsletter</h3>
            <p className="text-sm">Receba novidades e ofertas exclusivas</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Seu e-mail" className="flex-1" />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Inscrever</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Velas BALM. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
