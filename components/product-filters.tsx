"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "velas-aromaticas", name: "Velas Aromáticas", count: 24 },
  { id: "difusores", name: "Difusores", count: 12 },
  { id: "home-sprays", name: "Home Sprays", count: 8 },
  { id: "kits-presente", name: "Kits Presente", count: 6 },
  { id: "acessorios", name: "Acessórios", count: 15 },
]

export function ProductFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 300])
  const [sortBy, setSortBy] = useState("relevance")

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 300])
    setSortBy("relevance")
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Ordenar por</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Mais relevantes</SelectItem>
              <SelectItem value="price-low">Menor preço</SelectItem>
              <SelectItem value="price-high">Maior preço</SelectItem>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="rating">Melhor avaliados</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                {category.name}
              </Label>
              <span className="text-sm text-primary">({category.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Faixa de Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider value={priceRange} onValueChange={setPriceRange} max={300} min={0} step={10} className="w-full" />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="text-foreground">R$ {priceRange[0]}</span>
            <span className="text-foreground">R$ {priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-white">
        Limpar Filtros
      </Button>
    </div>
  )
}
