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
    <section className="py-16 px-4 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Mais Vendidos</h2>
            <p className="text-lg text-foreground">Os produtos favoritos dos nossos clientes</p>
          </div>

          {/* Os botões usam a 'products.length' */}
          <div className="hidden md:flex space-x-2">
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

        {/* O grid renderiza os produtos do estado 'visibleProducts' */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Navegação mobile também usa 'products.length' */}
        <div className="flex justify-center space-x-2 mt-8 md:hidden">
          {/* ... (botões mobile) ... */}
        </div>
      </div>
    </section>
  )
}