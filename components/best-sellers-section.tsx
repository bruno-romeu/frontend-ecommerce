"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import api from '@/lib/api'
import { Product } from '@/lib/types'

export function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get('/product/bestsellers/');
        setProducts(response.data);
      } catch (error) {
        console.error("Falha ao buscar mais vendidos:", error);
      }
    };

    fetchBestSellers();
  }, []);

  // 3. A lógica do carrossel usa o estado 'products' em vez da lista estática
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + itemsPerView >= products.length ? 0 : prev + itemsPerView))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - itemsPerView < 0 ? Math.max(0, products.length - itemsPerView) : prev - itemsPerView,
    )
  }

  // Se ainda não houver produtos, não renderiza nada (ou um loader)
  if (products.length === 0) {
    return null; 
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <section className="py-12 sm:py-16 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">Mais Vendidos</h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground">Os produtos favoritos dos nossos clientes</p>
          </div>

          {/* Botões de navegação para desktop */}
          <div className="hidden lg:flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex + itemsPerView >= products.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Navegação mobile com botões */}
        <div className="flex justify-center space-x-2 mt-6 sm:mt-8 lg:hidden">
          <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= products.length}
          >
            Próximo <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}