import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  console.log("ProductCard está a renderizar o link para o slug:", product.slug); 
  return (
    <div className="relative group">
      <Link href={`/produto/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Ver produto</span>
      </Link>
      <img
        src={product.image ||"/placeholder.svg"}
        alt={product.name}
        width={400}
        height={500}
        className="w-full h-[350px] object-cover rounded-lg group-hover:opacity-80 transition-opacity"
      />
      <div className="p-4 bg-white dark:bg-gray-950 rounded-b-lg">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        {product.category && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
        )}
        <h4 className="font-bold text-xl mt-2">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(product.price))}
        </h4>
      </div>
    </div>
  );
}