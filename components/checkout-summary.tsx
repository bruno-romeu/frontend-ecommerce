"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import Link from "next/link"
import { Loader2 } from "lucide-react"
import api from "@/lib/api"

initMercadoPago('TEST-4e212cbb-aff5-468b-9d8a-f1b82557a03c')

interface CheckoutSummaryProps {
  handlePayment?: () => void
  isLoading?: boolean
  preferenceId?: string | null
  error?: string | null
  isFormValid?: boolean
  isCheckoutPage?: boolean
}

interface ShippingOption {
  servico: string
  preco: number
  prazo: number
}

export function CheckoutSummary({ 
  handlePayment, 
  isLoading, 
  preferenceId, 
  error, 
  isFormValid, 
  isCheckoutPage = false 
}: CheckoutSummaryProps) {
  const { cartItems, total } = useCart()
  
  const [cep, setCep] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<string>("")
  const [shippingError, setShippingError] = useState<string | null>(null)

  useEffect(() => {
    const savedCep = sessionStorage.getItem('shipping_cep')
    const savedOptions = sessionStorage.getItem('shipping_options')
    const savedSelected = sessionStorage.getItem('shipping_selected')

    if (savedCep) {
      setCep(savedCep)
    }
    if (savedOptions) {
      try {
        setShippingOptions(JSON.parse(savedOptions))
      } catch (e) {
        console.error('Erro ao recuperar opções de frete:', e)
      }
    }
    if (savedSelected) {
      setSelectedShipping(savedSelected)
    }
  }, [])

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value)
    setCep(formatted)
    setShippingError(null)
    sessionStorage.setItem('shipping_cep', formatted)
  }

  const calculateShipping = async () => {
    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      setShippingError("Por favor, insira um CEP válido")
      return
    }

    setIsCalculating(true)
    setShippingError(null)

    try {
      const cepLimpo = cep.replace(/\D/g, "")

      const response = await api.post('/cart/calculate-shipping/', { 
        cep: cepLimpo 
      })
      
      if (!response.data || response.data.length === 0) {
        setShippingError("Nenhuma opção de frete disponível para este CEP")
        return
      }

      setShippingOptions(response.data)
      setSelectedShipping("")
      sessionStorage.setItem('shipping_options', JSON.stringify(response.data))
      sessionStorage.removeItem('shipping_selected') 
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Erro ao calcular frete"
      setShippingError(errorMessage)
      setShippingOptions([])
      console.error("Erro ao calcular frete:", err)
    } finally {
      setIsCalculating(false)
    }
  }

  const getSelectedShippingPrice = () => {
    if (!selectedShipping) return 0
    const option = shippingOptions.find(opt => 
      `${opt.servico}-${opt.preco}` === selectedShipping
    )
    return option ? Number(option.preco) : 0
  }

  const freteValue = getSelectedShippingPrice()
  const totalFinal = total + freteValue

  const handleShippingSelect = (value: string) => {
    setSelectedShipping(value)
    sessionStorage.setItem('shipping_selected', value)
  }

  const resetShipping = () => {
    setCep("")
    setShippingOptions([])
    setSelectedShipping("")
    setShippingError(null)
    sessionStorage.removeItem('shipping_cep')
    sessionStorage.removeItem('shipping_options')
    sessionStorage.removeItem('shipping_selected')
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-semibold font-serif">Resumo do Pedido</h2>

      <Separator />
      
      <div className="space-y-2 text-sm sm:text-base">
        <div className="flex justify-between">
          <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
          <span className="font-medium">R$ {total.toFixed(2).replace(".", ",")}</span>
        </div>

        {/* Seção de Cálculo de Frete */}
        <div className="pt-2 space-y-3">
          {shippingOptions.length === 0 ? (
            <div className="space-y-2">
              <Label htmlFor="cep" className="text-sm font-medium">
                Calcular entrega
              </Label>
              <div className="flex gap-2">
                <Input
                  id="cep"
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={handleCepChange}
                  maxLength={9}
                  className="flex-1"
                  disabled={isCalculating}
                />
                <Button
                  onClick={calculateShipping}
                  disabled={isCalculating || !cep}
                  size="sm"
                  variant="outline"
                >
                  {isCalculating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Calcular"
                  )}
                </Button>
              </div>
              {shippingError && (
                <p className="text-destructive text-xs">{shippingError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Opções de entrega</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetShipping}
                  className="h-auto p-1 text-xs text-muted hover:text-foreground cursor-pointer"
                >
                  Alterar CEP
                </Button>
              </div>
              
              <RadioGroup value={selectedShipping} onValueChange={handleShippingSelect}>
                {shippingOptions.map((option) => {
                  const optionValue = `${option.servico}-${option.preco}`
                  return (
                    <div key={optionValue} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value={optionValue} id={optionValue} />
                      <Label
                        htmlFor={optionValue}
                        className="flex-1 cursor-pointer text-sm leading-tight"
                      >
                        <div className="font-medium">{option.servico}</div>
                        <div className="text-xs text-muted">
                          {option.prazo} {option.prazo === 1 ? 'dia útil' : 'dias úteis'}
                        </div>
                      </Label>
                      <span className="font-semibold text-sm">
                        R$ {Number(option.preco).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
          )}
        </div>

        {/* Linha do Frete */}
        {shippingOptions.length > 0 && (
          <div className="flex justify-between pt-2">
            <span>Frete</span>
            <span className="font-medium">
              {selectedShipping 
                ? `R$ ${freteValue.toFixed(2).replace(".", ",")}` 
                : "Selecione uma opção"}
            </span>
          </div>
        )}
      </div>

      <Separator />
      
      <div className="flex justify-between font-bold text-base sm:text-lg">
        <span>Total</span>
        <span>R$ {totalFinal.toFixed(2).replace(".", ",")}</span>
      </div>

      <div className="mt-4">
        {isCheckoutPage ? (
          <>
            {!preferenceId ? (
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent text-foreground text-sm sm:text-base"
                onClick={handlePayment}
                disabled={!isFormValid || isLoading || (shippingOptions.length > 0 && !selectedShipping)}
              >
                {isLoading ? "Aguarde..." : "Finalizar e Pagar"}
              </Button>
            ) : (
              <Wallet initialization={{ preferenceId: preferenceId }} />
            )}
            {error && <p className="text-destructive text-xs sm:text-sm mt-2 text-center">{error}</p>}
          </>
        ) : (
          <Link href="/checkout" className="w-full">
            <Button size="lg" className="w-full bg-accent hover:bg-accent-hover text-white cursor-pointer text-sm sm:text-base">
              Ir para o Checkout
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}