import { ProductCard } from "@/components/product-card"

interface RelatedProductsProps {
  currentProductId: number
  category: string
}

// Mock related products - in a real app, this would come from an API
const getRelatedProducts = (currentProductId: number, category: string) => {
  const allProducts = [
    {
      id: 2,
      name: "Difusor Vanilla & Amber",
      price: 129.9,
      image: "/elegant-reed-diffuser-with-vanilla-amber-scent-in-.jpg",
      rating: 4.9,
      category: "difusores",
    },
    {
      id: 3,
      name: "Vela Eucalipto & Menta",
      price: 79.9,
      image: "/eucalyptus-mint-candle-in-frosted-glass-jar-with-g.jpg",
      rating: 4.7,
      category: "velas-aromaticas",
    },
    {
      id: 5,
      name: "Vela Flor de Cerejeira",
      price: 94.9,
      image: "/cherry-blossom-candle-in-elegant-pink-glass-jar-wi.jpg",
      rating: 4.6,
      category: "velas-aromaticas",
    },
    {
      id: 9,
      name: "Vela Rosa & Peônia",
      price: 89.9,
      image: "/rose-peony-candle-in-elegant-pink-ceramic-jar-wit.jpg",
      rating: 4.8,
      category: "velas-aromaticas",
    },
  ]

  return allProducts.filter((product) => product.id !== currentProductId && product.category === category).slice(0, 4)
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const relatedProducts = getRelatedProducts(currentProductId, category)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">Produtos Relacionados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
