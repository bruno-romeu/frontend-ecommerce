"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Category, Essence } from "@/lib/types"
import api from "@/lib/api"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Estados para dados da API
  const [categories, setCategories] = useState<Category[]>([])
  const [essences, setEssences] = useState<Essence[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Estados dos filtros (sincronizados com URL)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedEssences, setSelectedEssences] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<number[]>([0, 500])
  const [sortBy, setSortBy] = useState<string>("newest")

  // Buscar categorias e essências da API
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesRes, essencesRes] = await Promise.all([
          api.get('/product/categories/'),
          api.get('/product/essences/')
        ])

        // Filtrar essências que têm slug válido
        const validEssences = essencesRes.data.filter((e: Essence) => e.slug && e.slug.trim() !== '')

        setCategories(categoriesRes.data)
        setEssences(validEssences)
      } catch (error) {
        console.error("Erro ao buscar dados dos filtros:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilterData()
  }, [])

  // Sincronizar estados com URL ao carregar
  useEffect(() => {
    // Categorias
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(','))
    }

    // Essências
    const essenceParam = searchParams.get('essence')
    if (essenceParam) {
      setSelectedEssences(essenceParam.split(','))
    }

    // Preço
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 500
      ])
    }

    // Ordenação
    const ordering = searchParams.get('ordering')
    if (ordering) {
      setSortBy(ordering)
    }
  }, [searchParams])

  // Atualizar URL quando filtros mudarem
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/produtos?${params.toString()}`, { scroll: false })
  }

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    let newCategories: string[]

    if (checked) {
      newCategories = [...selectedCategories, categorySlug]
    } else {
      newCategories = selectedCategories.filter((slug) => slug !== categorySlug)
    }

    setSelectedCategories(newCategories)
    updateURL({
      category: newCategories.length > 0 ? newCategories.join(',') : null
    })
  }

  const handleEssenceChange = (essenceSlug: string, checked: boolean) => {
    if (!essenceSlug || essenceSlug.trim() === '') {
      return
    }

    let newEssences: string[]

    if (checked) {
      newEssences = [...selectedEssences, essenceSlug]
    } else {
      newEssences = selectedEssences.filter((slug) => slug !== essenceSlug)
    }

    setSelectedEssences(newEssences)
    updateURL({
      essence: newEssences.length > 0 ? newEssences.join(',') : null
    })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  const handlePriceCommit = (value: number[]) => {
    updateURL({
      min_price: value[0] > 0 ? value[0].toString() : null,
      max_price: value[1] < 500 ? value[1].toString() : null
    })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)

    // Mapear valores do select para o formato da API
    const orderingMap: Record<string, string> = {
      'newest': '-created_at',
      'price-low': 'price',
      'price-high': '-price',
      'name': 'name'
    }

    updateURL({
      ordering: orderingMap[value] || '-created_at'
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedEssences([])
    setPriceRange([0, 500])
    setSortBy('newest')
    router.push('/produtos')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground text-center">Carregando filtros...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Ordenar por</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="price-low">Menor preço</SelectItem>
              <SelectItem value="price-high">Maior preço</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.slug}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
                />
                <Label htmlFor={`category-${category.slug}`} className="flex-1 cursor-pointer text-sm">
                  {category.name}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Essences Filter */}
      {essences.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Essências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {essences.map((essence) => (
              <div key={essence.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`essence-${essence.slug}`}
                  checked={selectedEssences.includes(essence.slug)}
                  onCheckedChange={(checked) => handleEssenceChange(essence.slug, checked as boolean)}
                />
                <Label htmlFor={`essence-${essence.slug}`} className="flex-1 cursor-pointer text-sm">
                  {essence.name}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">Faixa de Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceCommit}
              max={500}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="text-foreground">R$ {priceRange[0]}</span>
            <span className="text-foreground">R$ {priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full bg-white"
        disabled={selectedCategories.length === 0 && selectedEssences.length === 0 && priceRange[0] === 0 && priceRange[1] === 500 && sortBy === 'newest'}
      >
        Limpar Filtros
      </Button>
    </div>
  )
}
