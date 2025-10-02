"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { AddressCard } from "./address-card";
import api from "@/lib/api";
import { Value } from "@radix-ui/react-select";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  cpf?: string;
  phone_number?: string;
  birthday?: string;
}

interface EditFormData {
  name: string;
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
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  onAddressUpdate: (updateAddress: Address) => void;
}

export function ProfileContent({ activeTab, profile, addresses, onProfileUpdate, onAddressUpdate }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditFormData>({name: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setEditData({
      name: `${profile.first_name} ${profile.last_name}`,
      cpf: profile.cpf || "",
      phone_number: profile.phone_number || "",
      birthday: profile.birthday || "",
    });
  },
  [profile, isEditing]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setEditData(prev => ({...prev, [name]:value}));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const {cpf, phone_number} = editData;
    if (cpf && cpf.trim() !== "") {
      const cpfDigits = cpf.replace(/\D/g, '');
      if (cpfDigits.length !== 11) {
        newErrors.cpf = "O CPF deve conter 11 digitos.";
      }
    }

    if (phone_number && phone_number.trim() !== "") {
      const phoneDigits = phone_number.replace(/\D/g, '')
      if(phoneDigits.length < 10 || phoneDigits.length > 11) {
        newErrors.phone_number = "O telefone deve conter 10 ou 11 dígitos (com DDD)."
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSave = async() => {
    if (!validateForm()) {
      return
    }
    setIsLoading(true);
    setErrors({});

    const nameParts = editData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const payload = {
      first_name: firstName,
      last_name: lastName || firstName,
      cpf: editData.cpf,
      phone_number: editData.phone_number,
      birthday: editData.birthday,
    };

    try {
      const response = await api.patch('/client/profile/', payload);
      onProfileUpdate(response.data);
      setIsEditing(false);
    } catch (error:any) {
      console.error("Falha ao atualizar dados do perfil: ", error);

      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({form: "Ocorreu um erro inesperado."})
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <main className="md:col-span-3">
      {activeTab === 'dados' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Informações Pessoais</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm pt-4">
              <div className="space-y-1 md:col-span-2">
                <Label className="text-foreground">Nome Completo</Label>
                {isEditing ? (
                  <Input name="name" value={editData.name} onChange={handleInputChange} />
                ) : (
                  <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">E-mail</Label>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Telefone</Label>
                {isEditing ? (
                  <>
                    <Input name="phone_number" maxLength={11} value={editData.phone_number || ""}
                    onChange={handleInputChange} className={errors.phone_number ? "border-destructive" : ""} />
                    {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number}</p>}
                  </>
                ) : (
                  <p className="font-medium">{profile.phone_number || "Não informado"}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">CPF</Label>
                {isEditing ? (
                  <>
                    <Input name="cpf" placeholder="XXX.XXX.XXX-XX" maxLength={11} value={editData.cpf || ""}
                    onChange={handleInputChange} className={errors.cpf ? "border-destructive" : ""} />
                    {errors.cpf && <p className="text-xs text-destructive">{errors.cpf}</p>}
                  </>
                ) : (
                  <p className="font-medium">{profile.cpf || "Não informado"}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Data de Nascimento</Label>
                {isEditing ? (
                  <Input name="birthday" type="date" value={editData.birthday || ""}
                  onChange={handleInputChange} />
                ) : (
                  <p className="font-medium">{profile.birthday || "Não informado"}</p>
                )};
              </div>

              {isEditing && (
                <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                  <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "A salvar..." : "Salvar Alterações"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {addresses.map(address => (
            <AddressCard 
              key={address.id} 
              address={address} 
              onUpdate={onAddressUpdate} 
            />
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