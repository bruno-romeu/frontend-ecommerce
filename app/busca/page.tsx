import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchResults } from "@/components/search-results"

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Resultados da Busca</h1>
            {query && (
              <p className="text-muted-foreground text-lg">
                Mostrando resultados para: <span className="font-medium">"{query}"</span>
              </p>
            )}
          </div>
          <SearchResults query={query} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
