import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          Nenhum produto foi encontrado.
        </p>
      )}
    </div>
  );
}