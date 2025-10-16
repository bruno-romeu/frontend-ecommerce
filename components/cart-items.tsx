"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Plus, Minus, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function CartItems() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-6">
      {cartItems.map((item, index) => (
        <div key={item.cartItemId}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0 w-full">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-foreground">
                    {item.size?.name} / {item.essence?.name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive shrink-0 sm:hidden"
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-bold text-lg sm:text-xl mb-3 sm:mb-0">
                R$ {(+item.price).toFixed(2).replace(".", ",")}
              </p>
              <div className="flex items-center justify-between sm:justify-start gap-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={item.quantity <= 1} onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[2rem] text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex text-xs text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  <X className="h-3 w-3 mr-1" /> Remover
                </Button>
              </div>
            </div>
          </div>
          {index < cartItems.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  )
}