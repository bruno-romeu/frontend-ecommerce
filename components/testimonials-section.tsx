import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    rating: 5,
    comment:
      "As velas da Lumina transformaram completamente o ambiente da minha casa. O aroma é incrível e dura muito tempo. Recomendo demais!",
    location: "São Paulo, SP",
  },
  {
    id: 2,
    name: "João Santos",
    rating: 5,
    comment:
      "Comprei o kit relaxamento e foi a melhor compra que fiz. A qualidade é excepcional e o atendimento é perfeito. Já virei cliente fiel!",
    location: "Rio de Janeiro, RJ",
  },
  {
    id: 3,
    name: "Ana Costa",
    rating: 5,
    comment:
      "Presenteei minha mãe com uma vela de lavanda e ela ficou encantada. O produto chegou super bem embalado e o cheiro é maravilhoso.",
    location: "Belo Horizonte, MG",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-foreground">
            Depoimentos reais de quem já experimentou a magia dos nossos produtos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "text-primary fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                <p className="mb-4 leading-relaxed text-black">"{testimonial.comment}"</p>

                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
