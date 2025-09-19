"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { ProfileContent } from "@/components/profile-content";

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
    return <div className="container py-8 text-center">A carregar perfil...</div>;
  }

  if (error) {
    return <div className="container py-8 text-center text-destructive">{error}</div>;
  }

  if (!user || !profile) {
    return <div className="container py-8 text-center">Por favor, faça login para ver o seu perfil.</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <ProfileSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={logout}
        />
        <ProfileContent 
          activeTab={activeTab}
          profile={profile}
          addresses={addresses}
        />
      </div>
    </div>
  );
}