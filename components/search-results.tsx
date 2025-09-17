"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"

interface SearchResultsProps {
  query: string
}

// Mock search function
const searchProducts = (query: string) => {
  const allProducts = [
    {
      id: 1,
      name: "Vela Lavanda Francesa",
      price: 89.9,
      image: "/luxury-lavender-candle-in-glass-jar-with-purple-wa.jpg",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Difusor Vanilla & Amber",
      price: 129.9,
      image: "/elegant-reed-diffuser-with-vanilla-amber-scent-in-.jpg",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Vela Eucalipto & Menta",
      price: 79.9,
      image: "/eucalyptus-mint-candle-in-frosted-glass-jar-with-g.jpg",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Home Spray Citrus Fresh",
      price: 59.9,
      image: "/citrus-fresh-home-spray-in-sleek-white-bottle-with.jpg",
      rating: 4.8,
    },
  ]

  if (!query) return allProducts

  return allProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    // Mock API delay
    const timer = setTimeout(() => {
      const searchResults = searchProducts(query)
      setResults(searchResults)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Buscando produtos...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Nenhum produto encontrado</h2>
        <p className="text-muted-foreground mb-8">Não encontramos produtos que correspondam à sua busca "{query}".</p>
        <p className="text-muted-foreground">Tente usar palavras-chave diferentes ou navegue por nossas categorias.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">
          {results.length} produto{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
