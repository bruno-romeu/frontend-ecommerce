"use client"

import { useState, useEffect } from "react";
import api from "@/lib/api"; 
import { Product } from "@/lib/types"; 
import { ProductCard } from "@/components/product-card";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<Product[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/product/products/', {
          params: { search: query }, 
        });
        setResults(response.data.results || response.data);
      } catch (error) {
        console.error("Falha ao buscar resultados da pesquisa:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]); 

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Buscando produtos...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="font-serif text-2xl font-semibold mb-4">Nenhum produto encontrado</h2>
        <p className="text-muted-foreground mb-8">Não encontramos produtos que correspondam à sua busca "{query}".</p>
        <p className="text-muted-foreground">Tente usar palavras-chave diferentes ou navegue por nossas categorias.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">
          {results.length} produto{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}