"use client"

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/context/CartContext";
import { CartItems } from "@/components/cart-items"; 
import { CheckoutSummary } from "@/components/checkout-summary";
import { Button } from "@/components/ui/button" 
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-2">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-6">
            Parece que você ainda não adicionou nenhum produto.
          </p>
          <Link href="/produtos">
            <Button>Continuar a Comprar</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8">Seu Carrinho</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          <div>
            <CheckoutSummary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}