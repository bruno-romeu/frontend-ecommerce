"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { SearchModal } from "@/components/search-modal"
import { UserDropdown } from "@/components/user-dropdown"
import { CartDropdown } from "@/components/cart-dropdown"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Category } from "@/lib/types"
import api from "@/lib/api"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('product/categories/'); 
        setCategories(response.data);
      } catch (error) {
        console.error("Falha ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);



  return (
    <>
      <nav className="sticky top-0 z-50 bg-muted text-muted-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">🦜</span>
              </div>
              <span className="font-serif text-xl font-semibold text-primary">BALM</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-primary transition-colors">
                Início
              </Link>
              <Link href="/produtos" className="hover:text-primary transition-colors">
                Todos os Produtos
              </Link>
              <div className="relative group">
                <button className="hover:text-primary transition-colors">Categorias</button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/produtos?categoria=${category.slug}`}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-muted-foreground"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/essencias" className="hover:text-primary transition-colors">
                Nossas Essências
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-primary text-white" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5 text-white" />
              </Button>

              <UserDropdown isLoggedIn={isAuthenticated} />

              <CartDropdown />

              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Início
                </Link>
                <Link
                  href="/produtos"
                  className="hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Todos os Produtos
                </Link>
                <div className="space-y-2 pl-4">
                  <Link
                    href="/produtos?categoria=velas-aromaticas"
                    className="block hover:text-primary transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Velas Aromáticas
                  </Link>
                  <Link
                    href="/produtos?categoria=difusores"
                    className="block hover:text-primary transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Difusores
                  </Link>
                  <Link
                    href="/produtos?categoria=home-sprays"
                    className="block hover:text-primary transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home Sprays
                  </Link>
                  <Link
                    href="/produtos?categoria=kits-presente"
                    className="block hover:text-primary transition-colors text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kits Presente
                  </Link>
                </div>
                <Link 
                  href="/essencias" 
                  className="hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nossas Essências
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
