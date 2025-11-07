"use client"

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductsGrid } from "@/components/products-grid"
import { ProductFilters } from "@/components/product-filters"
import { Product } from "@/lib/types";
import api from '@/lib/api'

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        const queryString = params.toString();
        
        console.log(`Buscando produtos com os filtros: /products/?${queryString}`);

        const response = await api.get(`product/products/?${queryString}`);
        setProducts(response.data.results || response.data);
      } catch (error) {
        console.error("Falha ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]); 

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-6 sm:mb-8">Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
        <aside className="md:col-span-1">
          <ProductFilters />
        </aside>
        <main className="md:col-span-3">
          {isLoading ? (
            <p className="text-center text-foreground">A carregar produtos...</p>
          ) : products.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <p className="text-center text-foreground">Nenhum produto encontrado com os filtros selecionados.</p>
          )}
        </main>
      </div>
    </div>
  );
}


export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Carregando filtros...</div>}>
            <ProductsPageContent />
        </Suspense>
    )
}