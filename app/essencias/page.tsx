"use client"; // Transforma em um Client Component

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Essence } from "@/lib/types";

export default function EssenciasPage() {
  const [essences, setEssences] = useState<Essence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEssences = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/essences/`;
        console.log("Tentando buscar da URL:", apiUrl);

        const response = await fetch(apiUrl, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`A chamada à API falhou com o status: ${response.status}`);
        }
        
        const data = await response.json();
        setEssences(data);
      } catch (err: any) {
        console.error("Erro detalhado ao buscar essências:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getEssences();
  }, []); 

  return (
    <div className="container mx-auto py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          Nossas Essências
        </h1>
        <p className="mt-4 text-lg text-foreground">
          Descubra as notas e sensações por trás de cada aroma que criamos. Nossas essências são selecionadas para transformar seu ambiente e despertar emoções.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-12 space-y-10">
        {loading && (
          <p className="text-center text-foreground">A carregar essências...</p>
        )}
        {error && (
          <p className="text-center text-destructive">
            Ocorreu um erro: {error}
          </p>
        )}
        {!loading && !error && (
          <>
            {essences.length > 0 ? (
              essences.map((essence, index) => (
                <div key={essence.id}>
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-semibold text-primary">
                      {essence.name}
                    </h2>
                    <p className="text-foreground whitespace-pre-line">
                      {essence.description}
                    </p>
                  </div>
                  {index < essences.length - 1 && <Separator className="mt-10" />}
                </div>
              ))
            ) : (
              <p className="text-center text-foreground">
                Nenhuma essência encontrada. Por favor, volte mais tarde.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}