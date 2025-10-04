"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Essence } from "@/lib/types";
import api from "@/lib/api";

export default function EssenciasPage() {
  const [essences, setEssences] = useState<Essence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEssences = async () => {
      const relativeUrl = '/product/essences/';
      
      const fullUrl = `${api}${relativeUrl}`;
      console.log("Tentando buscar da URL:", fullUrl);

      try {
        const response = await api.get(relativeUrl);
        
        setEssences(response.data);

      } catch (err: any) {
        console.error("Erro detalhado ao buscar essências:", err);
        
        if (err.response) {
          setError(`A chamada à API falhou com o status: ${err.response.status}`);
        } else {
          setError(err.message);
        }
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
        <hr />
      </div>

      <div className="max-w-3xl mx-auto mt-12 grid gap-8">
        {essences.length > 0 ? (
          essences.map((essence) => (
            <Card key={essence.id} className="bg-card/80 backdrop-blur-sm flex flex-col">
              <CardHeader>
                <CardTitle className="font-serif text-2xl font-semibold text-primary">
                  {essence.name}
                </CardTitle>
              </CardHeader>
              {/* Adicionamos 'flex-grow' para que o conteúdo empurre o rodapé para baixo */}
              <CardContent className="flex-grow">
                <p className="text-card-foreground whitespace-pre-line text-base leading-relaxed">
                  {essence.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full md:w-auto ml-auto">
                  <Link href={`/produtos?essencia=${essence.slug}`}>
                    Ver produtos com esta essência
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhuma essência encontrada. Por favor, volte mais tarde.
          </p>
        )}
      </div>
    </div>
  );
}