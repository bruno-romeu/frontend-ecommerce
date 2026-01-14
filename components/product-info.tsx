"use client"

import { useState } from "react";
import { Product, AvailableOptions, Size, Essence } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Star, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext"

interface ProductInfoProps {
  product: Product;
  availableOptions: AvailableOptions; 
  size: Size;
}

export function ProductInfo({ product, availableOptions, size }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(product.size?.id || null);
  const [selectedEssenceId, setSelectedEssenceId] = useState<number | null>(product.essence?.id || null);

  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    console.log(`Adicionado: ${quantity}x ${product.name}`);
    // Futuramente, adicionar uma notificação de "Produto adicionado!" aqui
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const hasStock = product.stock !== undefined && product.stock_quantity > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{product.name}</h1>
      
      <p className="text-2xl sm:text-3xl font-bold text-foreground">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      </p>

      {product.short_description && <p className="text-sm sm:text-base text-black">{product.short_description}</p>}

      {/* Status do Estoque */}
      <div className="text-sm font-medium">
        {hasStock ? (
          <span className="bg-green-100 rounded-2xl p-1.5 text-green-800">Em estoque</span>
        ) : (
          <span className="text-red-600">Fora de estoque</span>
        )}
      </div>

      {/* Variações */}
      <div className="space-y-4">
        {/* Seletor de Tamanho */}
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-medium text-foreground">Tamanho:</span>
                <span className="inline-flex flex-col items-center px-3 py-1 rounded-md bg-gray-200 text-sm font-semibold text-foreground">
                  <span className="mt-0.5 text-xl text-foreground">{size?.weight ?? product.size?.weight}{size?.unit ?? product.size?.unit}</span>
                </span>
            </div>
          </div>

        {/* Seletor de Essência */}
        {availableOptions.essences && availableOptions.essences.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Essência</label>
            <Select onValueChange={(value) => setSelectedEssenceId(Number(value))} defaultValue={selectedEssenceId?.toString()}>
              <SelectTrigger><SelectValue placeholder="Selecione a essência" /></SelectTrigger>
              <SelectContent>
                {availableOptions.essences.map((essence) => (
                  <SelectItem key={essence.id} value={essence.id.toString()}>
                    {essence.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Seletor de Quantidade */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Quantidade</label>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={decreaseQuantity} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
          <span className="text-base sm:text-lg font-medium w-12 text-center">{quantity}</span>
          <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={increaseQuantity} ><Plus className="h-4 w-4" /></Button>
        </div>
      </div>

      <Button
      size="lg"
      className="w-full bg-accent hover:bg-accent-hover text-foreground text-sm sm:text-base cursor-pointer"
      onClick={handleAddToCart}
      disabled={!hasStock || loading}
    >
      {loading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
    </Button>
    </div>
  );
}