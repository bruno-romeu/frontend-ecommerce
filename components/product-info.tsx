"use client"

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "recharts";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Product, AvailableOptions, Size } from "@/lib/types"; 
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext"

interface ProductInfoProps {
  product: Product;
  availableOptions: AvailableOptions; 
  size: Size;
}

export function ProductInfo({ product, availableOptions, size }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedEssenceId, setSelectedEssenceId] = useState<number | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<number[]>([]);
  const [customizationValues, setCustomizationValues] = useState<Record<number, string>>({});

  const { addToCart, loading } = useCart();

  useEffect(() => {
    setSelectedEssenceId(null);
    setSelectedCustomizations([]);
    setCustomizationValues({});
    setQuantity(1);
  }, [product.id]);

  const hasEssenceOptions = availableOptions.essences && availableOptions.essences.length > 0;
  
  const isEssenceSelectionMissing = hasEssenceOptions && selectedEssenceId === null;

  const hasStock = product.stock_quantity > 0;

  const handleCustomizationChange = (optionId: number, value: string) => {
    setCustomizationValues(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const handleAddCustomization = (customizationId: string) => {
    const id = Number(customizationId);
    if (!selectedCustomizations.includes(id)) {
      setSelectedCustomizations(prev => [...prev, id]);
    }
  };

  const handleRemoveCustomization = (customizationId: number) => {
    setSelectedCustomizations(prev => prev.filter(id => id !== customizationId));
    setCustomizationValues(prev => {
      const newValues = { ...prev };
      delete newValues[customizationId];
      return newValues;
    });
  };

  const handleAddToCart = async () => {
    if (isEssenceSelectionMissing) return;

    const customizationsArray = selectedCustomizations.map(optionId => ({
      option_id: optionId,
      value: customizationValues[optionId] || 'Sim'
    }));

    await addToCart(product, quantity, selectedEssenceId, customizationsArray);
    
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const getButtonText = () => {
    if (loading) return 'Adicionando...';
    if (!hasStock) return 'Fora de estoque';
    if (isEssenceSelectionMissing) return 'Selecione uma essência';
    return 'Adicionar ao Carrinho';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
        {product.name}
      </h1>
      
      <p className="text-2xl sm:text-3xl font-bold text-foreground">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      </p>

      {product.short_description && (
        <p className="text-sm sm:text-base text-black">{product.short_description}</p>
      )}

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
        <div>
           <div className="flex items-center space-x-3 mb-2">
             <span className="text-sm font-medium text-foreground">Tamanho:</span>
             <span className="inline-flex flex-col items-center px-3 py-1 rounded-md bg-gray-200 text-sm font-semibold text-foreground">
               <span className="mt-0.5 text-xl text-foreground">
                 {size?.weight ?? product.size?.weight}{size?.unit ?? product.size?.unit}
               </span>
             </span>
           </div>
        </div>

        {/* Seletor de Essência */}
        {hasEssenceOptions && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Escolha a Essência <span className="text-red-500">*</span>
            </label>
            <Select 
                onValueChange={(value) => setSelectedEssenceId(Number(value))} 
                value={selectedEssenceId ? selectedEssenceId.toString() : ""}
            >
              <SelectTrigger className={isEssenceSelectionMissing ? "border-foreground ring-1" : ""}>
                <SelectValue placeholder="Selecione a essência..." />
              </SelectTrigger>
              <SelectContent>
                {availableOptions.essences.map((essence) => (
                  <SelectItem key={essence.id} value={essence.id.toString()}>
                    {essence.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isEssenceSelectionMissing && (
                <p className="text-xs text-foreground mt-1">Obrigatório para este produto.</p>
            )}
          </div>
        )}

        {/* Personalizações */}
        {availableOptions.customizations && availableOptions.customizations.length > 0 && (
          <div className="space-y-4 border-t pt-6 mt-6">
            <h3 className="font-medium text-lg">Personalize seu pedido</h3>

            {/* Dropdown para adicionar personalização */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Adicionar personalização
              </label>
              <Select onValueChange={handleAddCustomization}>
                <SelectTrigger className="border-foregroung ring-1">
                  <SelectValue placeholder="Escolha uma opção de personalização" />
                </SelectTrigger>
                <SelectContent>
                  {availableOptions.customizations
                    .filter(opt => !selectedCustomizations.includes(opt.id))
                    .map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.name}
                        {option.price_extra && option.price_extra > 0 && 
                          ` (+${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price_extra)})`
                        }
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Personalizações selecionadas */}
            {selectedCustomizations.length > 0 && (
              <div className="space-y-4 mt-4">
                {selectedCustomizations.map((customizationId) => {
                  const option = availableOptions.customizations.find(opt => opt.id === customizationId);
                  if (!option) return null;

                  return (
                    <div key={option.id} className="border-secondary ring-1 rounded-lg p-4 space-y-3">
                      {/* Cabeçalho da personalização */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-base font-medium">
                            {option.name}
                          </h4>
                          {option.instruction && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {option.instruction}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {option.price_extra && option.price_extra > 0 && (
                            <span className="text-sm font-medium text-foreground">
                              + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price_extra)}
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCustomization(option.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>

                      {/* Campo de entrada baseado no tipo */}
                      {option.input_type === 'text' && (
                        <Input
                          placeholder="Digite aqui..."
                          value={customizationValues[option.id] || ''}
                          onChange={(e) => handleCustomizationChange(option.id, e.target.value)}
                        />
                      )}

                      {option.input_type === 'select' && (
                        <Select 
                          onValueChange={(val) => handleCustomizationChange(option.id, val)}
                          value={customizationValues[option.id] || ''}
                        >
                          <SelectTrigger className="border-foreground ring-1">
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            {option.available_options?.map((optVal, idx) => (
                              <SelectItem key={idx} value={optVal}>
                                {optVal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {option.input_type === 'boolean' && (
                        <div className="flex items-center space-x-2 ">
                          <Checkbox 
                            id={`cust-${option.id}`}
                            checked={customizationValues[option.id] === 'Sim'}
                            onCheckedChange={(checked) => 
                              handleCustomizationChange(option.id, checked ? 'Sim' : 'Não')
                            }
                          />
                          <label 
                            htmlFor={`cust-${option.id}`} 
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Sim, desejo adicionar
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Seletor de Quantidade */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Quantidade</label>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 sm:h-10 sm:w-10" 
              onClick={decreaseQuantity} 
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="text-base sm:text-lg font-medium w-12 text-center">
              {quantity}
            </span>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 sm:h-10 sm:w-10" 
              onClick={increaseQuantity} 
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full bg-accent hover:bg-accent-hover text-foreground text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={loading || !hasStock || isEssenceSelectionMissing}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}