import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductTabs } from "@/components/product-tabs"
import { RelatedProducts } from "@/components/related-products"
import { notFound } from "next/navigation"
import Link  from "next/link"
import { Product, AvailableOptions } from '@/lib/types'

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>
} 

async function getProductData(slug: string): Promise<{product: Product; available_options: AvailableOptions} | null> {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/products/${encodedSlug}/`;
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) { return null; }

    return response.json();
  } catch (error) {
    console.error(`Falha ao buscar produto com SLUG ${slug}:`, error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductData(slug);

  if (!data || !data.product) {
    notFound();
  }
  
  const { product, available_options: availableOptions } = data;


  
  const galleryImages = product.image ? [product.image] : [];

  return (
    <div className="min-h-screen">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <nav className="mb-8 text-sm text-foreground">
            <Link href="/" className="hover:text-accent-orange transition-colors">Início</Link>
            <span className="mx-2">/</span>
            <Link href="/produtos" className="hover:text-accent-orange transition-colors">Produtos</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ProductGallery images={galleryImages} productName={product.name} />
            <ProductInfo product={product} availableOptions={availableOptions} />
          </div>

          <ProductTabs product={product} />
          <RelatedProducts currentProductId={product.id} category={product.category || ""} />
        </div>
      </main>
    </div>
  )
}