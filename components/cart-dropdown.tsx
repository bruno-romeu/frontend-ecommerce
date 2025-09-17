"use client"

import { ShoppingCart, Plus, Minus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/CartContext" 
import Link from "next/link"

export function CartDropdown() {
  const { cartItems, updateQuantity, removeFromCart, total, cartItemCount } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:text-primary">
          <ShoppingCart className="h-5 w-5 text-white" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 z-[99]">
        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold mb-4">Carrinho ({cartItemCount} itens)</h3>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground">Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-foreground">R$ {(+item.price).toFixed(2).replace(".", ",")}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} variant="outline" size="icon" className="h-6 w-6 bg-transparent" disabled={item.quantity <= 1}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.cartItemId, (item.quantity + 1))} variant="outline" size="icon" className="h-6 w-6 bg-transparent">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={() => removeFromCart(item.cartItemId)} variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="space-y-2">
                  <Link href="/carrinho" className="block w-full">
                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Carrinho
                    </Button>
                  </Link>
                  <Link href="/checkout" className="block w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Finalizar Compra
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}