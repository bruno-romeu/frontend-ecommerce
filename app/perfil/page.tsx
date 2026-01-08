"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('dados');

  // Read tab from URL query parameter on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'pedidos' || tabParam === 'endereco' || tabParam === 'dados') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
  }

  const handleAddressUpdate = (updatedAddress: Address) => {
    setAddresses(prevAddresses =>
      prevAddresses.map(addr =>
        addr.id === updatedAddress.id ? updatedAddress : addr
      )
    );
  };
  
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-6 sm:mb-8">Meu Perfil</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={logout}
          />
          <ProfileContent
            activeTab={activeTab}
            profile={profile}
            addresses={addresses}
            onProfileUpdate={handleProfileUpdate}
            onAddressUpdate={handleAddressUpdate}
          />
        </div>
      </div>
    </div>
  );
}