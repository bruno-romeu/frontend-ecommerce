import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isBackorder = product.stock_quantity <= 0;

  return (
    <div className="relative group">
      <Link href={`/produto/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Ver produto</span>
      </Link>
      {isBackorder && (
        <span className="absolute left-3 top-3 z-20 rounded-full bg-accent/90 px-2 py-1 text-xs font-semibold text-foreground">
          Sob encomenda
        </span>
      )}
      <img
        src={product.image ||"/placeholder.svg"}
        alt={product.name}
        width={400}
        height={500}
        className="w-full h-[280px] sm:h-[320px] md:h-[350px] object-cover rounded-lg group-hover:opacity-80 transition-opacity"
      />
      <div className="p-3 sm:p-4 bg-white dark:bg-gray-950 rounded-b-lg">
        <h3 className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
        {product.category && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{product.category}</p>
        )}
        <h4 className="font-bold text-lg sm:text-xl mt-1 sm:mt-2">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(product.price))}
        </h4>
      </div>
    </div>
  );
}