import { Separator } from "@/components/ui/separator";
import { Essence } from "@/lib/types";


async function getEssences(): Promise<Essence[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/essences/`, {
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar as essências.');
    }
    
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function EssenciasPage() {
  const essences = await getEssences();

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
        {essences.length > 0 ? (
          essences.map((essence, index) => (
            <div key={essence.id}>
              <div className="space-y-2">
                {/* No futuro, a imagem pode ser adicionada aqui */}
                <h2 className="font-serif text-2xl font-semibold text-primary">
                  {essence.name}
                </h2>
                <p className="text-foreground whitespace-pre-line">
                  {essence.description} | "Essência maravilhosa!"
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
      </div>
    </div>
  );
}