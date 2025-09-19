"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function PendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('external_reference');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold tracking-tight">Pagamento Pendente</CardTitle>
          <CardDescription>Aguardando confirmação.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Estamos a aguardar a confirmação do seu pagamento. Você receberá uma notificação por e-mail assim que o seu pedido for aprovado.
          </p>
          {orderId && (
            <p className="text-lg font-medium bg-secondary p-2 rounded-md">
              Código do Pedido: <strong>#{orderId}</strong>
            </p>
          )}
          <Button asChild className="w-full">
            <Link href="/perfil/pedidos">Acompanhar Meus Pedidos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PendentePage() {
  return (
    <Suspense fallback={<div>A carregar...</div>}>
      <PendingContent />
    </Suspense>
  );
}