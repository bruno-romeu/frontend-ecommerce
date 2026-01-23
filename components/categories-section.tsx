"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  id: number
  name: string
  slug: string | null
  image: string | null
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const itemsPerView = 4

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/categories/`
        const response = await fetch(url, {
          next: { revalidate: 1800 },
        })

        if (!response.ok) {
          throw new Error("A resposta da rede não foi 'ok'")
        }

        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Falha ao buscar categorias:", error)
      }
    }

    fetchCategories()
  }, [])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + itemsPerView >= categories.length ? 0 : prev + itemsPerView))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) =>
      prev - itemsPerView < 0 ? Math.max(0, categories.length - itemsPerView) : prev - itemsPerView
    )
    setTimeout(() => setIsTransitioning(false), 500)
  }

  if (categories.length === 0) {
    return null
  }

  const visibleCategories = categories.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <section className="py-12 md:py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">Nossas Categorias</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Explore nossas coleções exclusivas
            </p>
          </div>

          {/* Botões de navegação para desktop */}
          <div className="hidden lg:flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevSlide} 
              disabled={currentIndex === 0 || isTransitioning}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex + itemsPerView >= categories.length || isTransitioning}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Container com overflow hidden para animação */}
        <div className="overflow-hidden">
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-500 ease-in-out"
            style={{
              opacity: isTransitioning ? 0.5 : 1,
              transform: isTransitioning ? 'translateX(-20px)' : 'translateX(0)'
            }}
          >
            {visibleCategories.map((category) => (
              <div 
                key={category.id} 
                className="relative group overflow-hidden rounded-lg transform transition-all duration-300"
              >
                <Link href={`/produtos?category=${category.slug}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Ver {category.name}</span>
                </Link>
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={`Imagem da categoria ${category.name}`}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/40">
                  <h3 className="text-2xl font-bold text-white tracking-wider">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegação mobile com botões */}
        <div className="flex justify-center space-x-2 mt-6 md:mt-8 lg:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={prevSlide} 
            disabled={currentIndex === 0 || isTransitioning}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= categories.length || isTransitioning}
          >
            Próximo <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}