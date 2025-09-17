"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock search results
const mockProducts = [
  {
    id: 1,
    name: "Vela Lavanda Francesa",
    price: 89.9,
    image: "/luxury-lavender-candle-in-glass-jar-with-purple-wa.jpg",
  },
  {
    id: 2,
    name: "Difusor Vanilla & Amber",
    price: 129.9,
    image: "/elegant-reed-diffuser-with-vanilla-amber-scent-in-.jpg",
  },
  {
    id: 3,
    name: "Vela Eucalipto & Menta",
    price: 79.9,
    image: "/eucalyptus-mint-candle-in-frosted-glass-jar-with-g.jpg",
  },
  {
    id: 4,
    name: "Home Spray Citrus Fresh",
    price: 59.9,
    image: "/citrus-fresh-home-spray-in-sleek-white-bottle-with.jpg",
  },
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockProducts>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true)
      // Mock search delay
      const timer = setTimeout(() => {
        const results = mockProducts.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        setSearchResults(results)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">Buscar Produtos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite o nome do produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Buscando produtos...</p>
            </div>
          )}

          {searchQuery.length > 2 && !isLoading && searchResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum produto encontrado para "{searchQuery}"</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/produto/${product.id}`}
                  onClick={handleClose}
                  className="flex items-center space-x-3 p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {searchQuery.length > 2 && (
            <div className="border-t pt-4">
              <Link href={`/busca?q=${encodeURIComponent(searchQuery)}`} onClick={handleClose}>
                <Button variant="outline" className="w-full bg-transparent">
                  Ver todos os resultados para "{searchQuery}"
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
