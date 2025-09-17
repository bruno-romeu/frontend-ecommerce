"use client"

import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Plus, Minus, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function CartItems() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {cartItems.map((item, index) => (
        <div key={item.id}>
          <div className="flex items-start space-x-4">
            <img 
              src={item.image || "/placeholder.svg"} 
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-foreground">
                {item.size?.name} / {item.essence?.name}
              </p>
              <p className="font-bold mt-1">
                R$ {(+item.price).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                <X className="h-3 w-3 mr-1" /> Remover
              </Button>
            </div>
          </div>
          {index < cartItems.length - 1 && <Separator className="mt-6" />}
        </div>
      ))}
    </div>
  )
}