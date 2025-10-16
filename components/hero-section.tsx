'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroData {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  background_image_url: string
}

export function HeroSection() {
  const [hero, setHero] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiUrl) {
          throw new Error('NEXT_PUBLIC_API_URL não configurada')
        }

        const response = await fetch(`${apiUrl}/site-config/hero/`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`)
        }

        const data = await response.json()
        setHero(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(message)
        console.error('Erro ao buscar hero section:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHero()
  }, [])

  // Estado de carregamento com skeleton
  if (loading) {
    return (
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gray-300 animate-pulse">
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="h-16 bg-gray-400 rounded mb-6 w-3/4 mx-auto" />
          <div className="h-6 bg-gray-400 rounded mb-4 w-2/3 mx-auto" />
          <div className="h-6 bg-gray-400 rounded mb-8 w-2/3 mx-auto" />
          <div className="h-12 bg-gray-400 rounded w-40 mx-auto" />
        </div>
      </section>
    )
  }

  // Estado de erro
  if (error || !hero) {
    return (
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="relative z-10 text-center text-white">
          <p className="text-lg">Desculpe, não foi possível carregar o conteúdo.</p>
          {error && <p className="text-sm text-gray-400 mt-2">{error}</p>}
        </div>
      </section>
    )
  }

  // Estado de sucesso com dados dinâmicos
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.background_image_url}
          alt={hero.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-balance">
          {hero.title}
        </h1>
        {hero.subtitle && (
          <p className="text-lg md:text-xl mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        )}
        <Link href={hero.button_link}>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg"
          >
            {hero.button_text}
          </Button>
        </Link>
      </div>
    </section>
  )
}