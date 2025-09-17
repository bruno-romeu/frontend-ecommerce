"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function OrderSummary() {
  const [couponCode, setCouponCode] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [shipping, setShipping] = useState<{ method: string; price: number } | null>(null)
  const [discount, setDiscount] = useState(0)

  const subtotal = 309.6 // Sum of all items
  const total = subtotal - discount + (shipping?.price || 0)

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === "desconto10") {
      setDiscount(subtotal * 0.1)
    } else {
      setDiscount(0)
    }
  }

  const calculateShipping = () => {
    // Mock shipping calculation
    if (zipCode.length === 8) {
      setShipping({ method: "Correios - PAC", price: 15.9 })
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="font-serif">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
        </div>

        {/* Coupon Section */}
        <div className="space-y-3">
          <Label htmlFor="coupon">Cupom de Desconto</Label>
          <div className="flex space-x-2">
            <Input
              id="coupon"
              placeholder="Digite o código"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button variant="outline" onClick={applyCoupon}>
              Aplicar
            </Button>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto</span>
              <span>-R$ {discount.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
        </div>

        {/* Shipping Section */}
        <div className="space-y-3">
          <Label htmlFor="zipcode">Calcular Frete</Label>
          <div className="flex space-x-2">
            <Input
              id="zipcode"
              placeholder="00000-000"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={8}
            />
            <Button variant="outline" onClick={calculateShipping}>
              Calcular
            </Button>
          </div>
          {shipping && (
            <div className="flex justify-between">
              <span>{shipping.method}</span>
              <span>R$ {shipping.price.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>R$ {total.toFixed(2).replace(".", ",")}</span>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout" className="block">
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Finalizar Compra
          </Button>
        </Link>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>✓ Compra 100% segura</p>
          <p>✓ Frete grátis acima de R$ 150</p>
          <p>✓ Parcelamento em até 12x</p>
        </div>
      </CardContent>
    </Card>
  )
}
