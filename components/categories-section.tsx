import Link from "next/link"
  import { Card, CardContent } from "@/components/ui/card"
import api from '@/lib/api'

interface Category{
  id: number;
  name: string;
  slug: string | null;
  image: string | null;
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await api.get('product/categories/');
    return response.data;
  } catch (error) {
    console.error("Falha ao buscar categorias:", error);
    return [];
  }
}

export async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className="py-12 md:py-20 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Nossas Categorias</h2>
          <p className="text-gray-500 mt-2">Explore nossas coleções exclusivas</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="relative group overflow-hidden rounded-lg">
              <Link href={`/produtos?category=${category.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">Ver {category.name}</span>
              </Link>
              <img
                src={category.image || "/placeholder.svg"}
                alt={`Imagem da categoria ${category.name}`}
                width={600}
                height={400}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white tracking-wider">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}