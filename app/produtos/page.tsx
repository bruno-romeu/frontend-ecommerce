import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductsGrid } from "@/components/products-grid"
import { ProductFilters } from "@/components/product-filters"
import api from '@/lib/api' 

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  image_url: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await api.get('product/products/');
    return response.data;
  } catch (error) {
    console.error("Falha ao buscar produtos:", error);
    return []; 
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Todos os Produtos</h1>
            <p className="text-lg text-foreground">
              Descubra nossa coleção completa de velas artesanais e produtos aromáticos
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters />
            </aside>

            <div className="flex-1">
              {}
              <ProductsGrid products={products} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}