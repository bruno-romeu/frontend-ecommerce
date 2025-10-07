"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import api from "@/lib/api"
import { Product } from "@/lib/types" 

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([]) 
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const response = await api.get('/product/products/', {
          params: { search: searchQuery },
        });
        setSearchResults(response.data.results || response.data);
      } catch (error) {
        console.error("Falha na busca de produtos:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground" />
            <Input
              placeholder="Digite o nome do produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {isLoading && <p className="text-center text-foreground py-8">Buscando produtos...</p>}
          
          {searchQuery.length > 2 && !isLoading && searchResults.length === 0 && (
            <p className="text-center text-foreground py-8">Nenhum produto encontrado para "{searchQuery}"</p>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/produto/${product.slug}`}
                  onClick={handleClose}
                  className="flex items-center space-x-3 p-3 hover:bg rounded-lg transition-colors"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-foreground">R$ {parseFloat(product.price).toFixed(2).replace(".", ",")}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {searchQuery.length > 2 && (
            <div className="border-t pt-4">
              <Link href={`/produtos?search=${encodeURIComponent(searchQuery)}`} onClick={handleClose}>
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