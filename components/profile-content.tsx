"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  cpf?: string;
  phone_number?: string;
  birthday?: string;
}

interface Address {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  complement?: string;
}

interface ProfileContentProps {
  activeTab: string;
  profile: UserProfile;
  addresses: Address[];
}

export function ProfileContent({ activeTab, profile, addresses }: ProfileContentProps) {
  return (
    <main className="md:col-span-3">
      {activeTab === 'dados' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Informações Pessoais</CardTitle>
              <Button variant="outline" size="sm">Editar</Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm pt-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Nome Completo</Label>
                <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">E-mail</Label>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Telefone</Label>
                <p className="font-medium">{profile.phone_number || "Não informado"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">CPF</Label>
                <p className="font-medium">{profile.cpf || "Não informado"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Data de Nascimento</Label>
                <p className="font-medium">{profile.birthday || "Não informado"}</p>
              </div>
            </CardContent>
          </Card>

          {addresses.map(address => (
            <Card key={address.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Endereço de Entrega</CardTitle>
                <Button variant="outline" size="sm">Editar</Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm pt-4">
                {/* ... conteúdo do endereço ... */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'pedidos' && (
        <Card>
          <CardHeader><CardTitle>Meus Pedidos</CardTitle></CardHeader>
          <CardContent><p>A funcionalidade de histórico de pedidos será implementada em breve.</p></CardContent>
        </Card>
      )}
    </main>
  );
}