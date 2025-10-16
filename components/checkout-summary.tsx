// frontend/components/checkout-summary.tsx
"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import Link from "next/link";

initMercadoPago('TEST-4e212cbb-aff5-468b-9d8a-f1b82557a03c');

interface CheckoutSummaryProps {
  handlePayment?: () => void;
  isLoading?: boolean;
  preferenceId?: string | null;
  error?: string | null;
  isFormValid?: boolean;
  isCheckoutPage?: boolean;
}

export function CheckoutSummary({ 
  handlePayment, 
  isLoading, 
  preferenceId, 
  error, 
  isFormValid, 
  isCheckoutPage = false 
}: CheckoutSummaryProps) {
  const { cartItems, total } = useCart();
  const frete = total > 150 ? 0 : 25;
  const totalFinal = total + frete;

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-semibold font-serif">Resumo do Pedido</h2>

      <Separator />
      <div className="space-y-2 text-sm sm:text-base">
        <div className="flex justify-between">
          <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</span>
          <span className="font-medium">R$ {total.toFixed(2).replace(".", ",")}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete</span>
          <span className="font-medium">{frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2).replace(".", ",")}`}</span>
        </div>
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
                disabled={!isFormValid || isLoading}
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