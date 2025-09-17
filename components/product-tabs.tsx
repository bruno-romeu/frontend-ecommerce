"use client"

import { Product } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList>
        <TabsTrigger value="description">Descrição Completa</TabsTrigger>
        <TabsTrigger value="reviews">Avaliações</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="mt-4">
        {/* 3. Adicionamos uma verificação para garantir que a descrição existe antes de exibi-la */}
        <p className="text-foreground whitespace-pre-wrap">
          {product.full_description || "Nenhuma descrição detalhada disponível."}
        </p>
      </TabsContent>
      <TabsContent value="reviews" className="mt-4">
        <p className="text-foreground">
          {product.reviewCount ? `Total de ${product.reviewCount} avaliações.` : "Ainda não há avaliações para este produto."}
        </p>
        {/* renderizaria as avaliações */}
      </TabsContent>
    </Tabs>
  )
}