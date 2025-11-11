import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FalhaPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold tracking-tight">Pagamento Recusado</CardTitle>
          <CardDescription className='text-red-600'>Não foi possível processar o seu pagamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-default">
            Houve um problema com a sua forma de pagamento e nenhum valor foi cobrado. Por favor, verifique os seus dados ou tente um método diferente.
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/checkout">Tentar Novamente</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Voltar para a Loja</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}