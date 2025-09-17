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
}

export function ProductInfo({ product, availableOptions }: ProductInfoProps) {
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
    <div className="space-y-6">
      <h1 className="font-serif text-3xl md:text-4xl font-bold">{product.name}</h1>
      
      {/* ... (código de avaliação e preço continua o mesmo) ... */}

      <p className="text-3xl font-bold text-foreground">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      </p>

      {product.short_description && <p className="text-black">{product.short_description}</p>}

      {/* Status do Estoque */}
      <div className="text-sm font-medium">
        {hasStock ? (
          <span className="bg-green-100 rounded-2xl p-1.5 text-green-800">Em estoque ({product.stock_quantity} unidades)</span>
        ) : (
          <span className="text-red-600">Fora de estoque</span>
        )}
      </div>

      {/* Variações */}
      <div className="space-y-4">
        {/* Seletor de Tamanho */}
        {availableOptions.sizes && availableOptions.sizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tamanho</label>
            <Select onValueChange={(value) => setSelectedSizeId(Number(value))} defaultValue={selectedSizeId?.toString()}>
              <SelectTrigger><SelectValue placeholder="Selecione o tamanho" /></SelectTrigger>
              <SelectContent>
                {availableOptions.sizes.map((size) => (
                  <SelectItem key={size.id} value={size.id.toString()}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
          <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button>
          <span className="text-lg font-medium w-12 text-center">{quantity}</span>
          <Button variant="outline" size="icon" onClick={increaseQuantity} ><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
      
      <Button 
      size="lg" 
      className="w-full bg-accent hover:bg-accent-hover text-foreground cursro-pointer" 
      onClick={handleAddToCart} 
      disabled={!hasStock || loading} 
    >
      {loading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
    </Button>
    </div>
  );
}