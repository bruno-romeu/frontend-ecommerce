"use client";

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { ProfileContent } from "@/components/profile-content"
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, LogOut } from "lucide-react";

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

export default function PerfilPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dados');
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Busca os dados do perfil e os endereços em paralelo
        const [profileResponse, addressesResponse] = await Promise.all([
          api.get('/client/profile/'),
          api.get('/client/addresses/')
        ]);
        setProfile(profileResponse.data);
        setAddresses(addressesResponse.data);
        setError(null);
      } catch (err) {
        console.error("Falha ao buscar dados do perfil:", err);
        setError("Não foi possível carregar os seus dados.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div>A carregar perfil...</div>;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  if (!user || !profile) {
    return <div>Por favor, faça login para ver o seu perfil.</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-2">
            <Button
              variant={activeTab === 'dados' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dados')}
              className="justify-start"
            >
              <User className="mr-2 h-4 w-4" /> Meus Dados
            </Button>
            <Button
              variant={activeTab === 'pedidos' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('pedidos')}
              className="justify-start"
            >
              <User className="mr-2 h-4 w-4" /> Meus Pedidos
            </Button>
            <Button variant="ghost" onClick={logout} className="justify-start text-red-500 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </nav>
        </aside>

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
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">CEP</Label>
                      <p className="font-medium">{address.zipcode}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Cidade / Estado</Label>
                      <p className="font-medium">{address.city} / {address.state}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Bairro</Label>
                      <p className="font-medium">{address.neighborhood}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Endereço</Label>
                      <p className="font-medium">{address.street}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Número</Label>
                      <p className="font-medium">{address.number}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground">Complemento</Label>
                      <p className="font-medium">{address.complement || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>A funcionalidade de histórico de pedidos será implementada em breve.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}