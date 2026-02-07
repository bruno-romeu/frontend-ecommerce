"use client"

import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
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
  const [customizationErrors, setCustomizationErrors] = useState<Record<number, string>>({});
  const [lastAddedCustomizationId, setLastAddedCustomizationId] = useState<number | null>(null);
  const customizationFieldRefs = useRef<Record<number, HTMLInputElement | HTMLButtonElement | null>>({});
  const customizationCardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { addToCart, loading } = useCart();

  useEffect(() => {
    setSelectedEssenceId(null);
    setSelectedCustomizations([]);
    setCustomizationValues({});
    setQuantity(1);
  }, [product.id]);

  const hasEssenceOptions = availableOptions.essences && availableOptions.essences.length > 0;
  
  const isEssenceSelectionMissing = hasEssenceOptions && selectedEssenceId === null;

  const isBackorder = product.stock_quantity <= 0;

  const handleCustomizationChange = (optionId: number, value: string) => {
    setCustomizationValues(prev => ({
      ...prev,
      [optionId]: value
    }));
    if (customizationErrors[optionId]) {
      setCustomizationErrors((prev) => {
        const next = { ...prev };
        delete next[optionId];
        return next;
      });
    }
  };

  const handleAddCustomization = (customizationId: string) => {
    const id = Number(customizationId);
    if (!selectedCustomizations.includes(id)) {
      setSelectedCustomizations(prev => [...prev, id]);
      setLastAddedCustomizationId(id);
    }
  };

  const handleRemoveCustomization = (customizationId: number) => {
    setSelectedCustomizations(prev => prev.filter(id => id !== customizationId));
    setCustomizationValues(prev => {
      const newValues = { ...prev };
      delete newValues[customizationId];
      return newValues;
    });
    setCustomizationErrors(prev => {
      if (!prev[customizationId]) return prev;
      const next = { ...prev };
      delete next[customizationId];
      return next;
    });
  };

  useEffect(() => {
    if (!lastAddedCustomizationId) return;
    const field = customizationFieldRefs.current[lastAddedCustomizationId];
    const card = customizationCardRefs.current[lastAddedCustomizationId];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (field && "focus" in field) {
      field.focus();
    }
    setLastAddedCustomizationId(null);
  }, [lastAddedCustomizationId]);

  const handleAddToCart = async () => {
    if (isEssenceSelectionMissing) return;

    const errors: Record<number, string> = {};
    selectedCustomizations.forEach((optionId) => {
      const option = availableOptions.customizations?.find((cust) => cust.id === optionId);
      if (!option) return;
      const value = customizationValues[optionId];

      if (option.input_type === "text" && !value?.trim()) {
        errors[optionId] = "Preencha este campo.";
      }

      if (option.input_type === "select" && !value) {
        errors[optionId] = "Selecione uma opção.";
      }
    });

    if (Object.keys(errors).length > 0) {
      setCustomizationErrors(errors);
      return;
    }

    setCustomizationErrors({});

    const customizationsArray = selectedCustomizations.map(optionId => {
      const option = availableOptions.customizations?.find((cust) => cust.id === optionId);
      const value = customizationValues[optionId];

      if (option?.input_type === "boolean") {
        return { option_id: optionId, value: value || "Sim" };
      }

      return { option_id: optionId, value: value || "" };
    });

    await addToCart(product, quantity, selectedEssenceId, customizationsArray);
    
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const getButtonText = () => {
    if (loading) return 'Adicionando...';
    if (isEssenceSelectionMissing) return 'Selecione uma essência';
    if (isBackorder) return 'Comprar sob encomenda';
    return 'Adicionar ao Carrinho';
  };

  const selectedCustomizationOptions = availableOptions.customizations?.filter((option) =>
    selectedCustomizations.includes(option.id)
  ) || [];
  const selectedCustomizationExtra = selectedCustomizationOptions.reduce((sum, option) => {
    const extra = option.price_extra ? Number(option.price_extra) : 0;
    return sum + extra;
  }, 0);

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
      <div className="text-sm font-medium space-y-1">
        {isBackorder ? (
          <span className="inline-flex items-center rounded-2xl bg-accent/20 px-2 py-1 text-xs font-medium text-foreground">
            Sob encomenda
          </span>
        ) : (
          <span className="inline-flex items-center rounded-2xl bg-secondary/20 px-2 py-1 text-xs font-medium text-foreground">
            Em estoque
          </span>
        )}
        {isBackorder && (
          <p className="text-xs text-muted-foreground">
            Produzimos sob demanda. O prazo de envio pode ser maior.
          </p>
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
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Personalize seu pedido</h3>
              {selectedCustomizations.length > 0 && (
                <span className="text-xs text-foreground/80">
                  {selectedCustomizations.length} personaliza{selectedCustomizations.length > 1 ? "ções" : "ção"}
                  {selectedCustomizationExtra > 0 && (
                    <> • + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedCustomizationExtra)}</>
                  )}
                </span>
              )}
            </div>

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
                    <div
                      key={option.id}
                      ref={(ref) => {
                        customizationCardRefs.current[option.id] = ref;
                      }}
                      className="border-secondary ring-1 rounded-lg p-4 space-y-3"
                    >
                      {/* Cabeçalho da personalização */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-base font-medium">
                            {option.name}
                          </h4>
                          {option.instruction && (
                            <p className="text-sm text-foreground/80 mt-0.5">
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
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-foreground/80">Obrigatório</span>
                            {option.price_extra && option.price_extra > 0 && (
                              <span className="text-xs text-foreground/80">
                                + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price_extra)}
                              </span>
                            )}
                          </div>
                          <Input
                            ref={(ref) => {
                              customizationFieldRefs.current[option.id] = ref;
                            }}
                            placeholder="Digite aqui..."
                            value={customizationValues[option.id] || ''}
                            onChange={(e) => handleCustomizationChange(option.id, e.target.value)}
                            className={customizationErrors[option.id] ? "border-destructive ring-1 ring-destructive" : ""}
                          />
                          {customizationErrors[option.id] && (
                            <p className="text-xs text-destructive mt-1">
                              {customizationErrors[option.id]}
                            </p>
                          )}
                        </div>
                      )}

                      {option.input_type === 'select' && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-foreground/80">Obrigatório</span>
                            {option.price_extra && option.price_extra > 0 && (
                              <span className="text-xs text-foreground/80">
                                + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price_extra)}
                              </span>
                            )}
                          </div>
                          <Select 
                            onValueChange={(val) => handleCustomizationChange(option.id, val)}
                            value={customizationValues[option.id] || ''}
                          >
                            <SelectTrigger
                              ref={(ref) => {
                                customizationFieldRefs.current[option.id] = ref;
                              }}
                              className={customizationErrors[option.id] ? "border-destructive ring-1 ring-destructive" : "border-foreground ring-1"}
                            >
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
                          {customizationErrors[option.id] && (
                            <p className="text-xs text-destructive mt-1">
                              {customizationErrors[option.id]}
                            </p>
                          )}
                        </div>
                      )}

                      {option.input_type === 'boolean' && (
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`cust-${option.id}`}
                            ref={(ref) => {
                              customizationFieldRefs.current[option.id] = ref;
                            }}
                            checked={customizationValues[option.id] === 'Sim'}
                            onCheckedChange={(checked) => 
                              handleCustomizationChange(option.id, checked ? 'Sim' : 'Não')
                            }
                          />
                          <label 
                            htmlFor={`cust-${option.id}`} 
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Adicionar
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
          disabled={loading || isEssenceSelectionMissing}
        >
          {getButtonText()}
        </Button>
        {selectedCustomizations.length > 0 && (
          <p className="text-xs text-foreground/80 mt-2">
            Personalizações são aplicadas ao preço unitário do item.
          </p>
        )}
      </div>
    </div>
  );
}