"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('external_reference'); 

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold tracking-tight">Pagamento Aprovado!</CardTitle>
          <CardDescription>Obrigado pela sua compra.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Uma confirmação foi enviada para o seu email. O seu pedido está a ser preparado para envio.
          </p>
          {orderId && (
            <p className="text-lg font-medium bg-secondary p-2 rounded-md">
              Código do Pedido: <strong>#{orderId}</strong>
            </p>
          )}
          <Button asChild className="w-full">
            <Link href="/">Continuar a Comprar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <SuccessContent />
    </Suspense>
  );
}