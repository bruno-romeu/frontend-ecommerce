"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface AddressCardProps {
  address: Address;
  onUpdate: (updatedAddress: Address) => void;
}

interface StateOption {
  value: string;
  label: string;
}

export function AddressCard({ address, onUpdate }: AddressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Address>(address);
  const [isLoading, setIsLoading] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/auth/states/');
        setStates(response.data);
      } catch (error) {
        console.error("Falha ao buscar estados:", error);
      }
    };
    fetchStates();
  }, []);
  
  useEffect(() => {
    setEditData(address);
  }, [address, isEditing]);


  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        console.error("CEP não encontrado.");
        return;
      }
      setEditData(prev => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
    } catch (error) {
      console.error("Falha ao buscar CEP:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (value: string) => {
    setEditData(prev => ({ ...prev, state: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch(`/client/addresses/${address.id}/`, editData);
      onUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Falha ao atualizar endereço:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Endereço de Entrega</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm pt-4">
        
        <div className="space-y-1">
          <Label className="text-foreground">CEP</Label>
          {isEditing ? (
            <Input name="zipcode" value={editData.zipcode} onChange={handleInputChange} onBlur={handleCepBlur} placeholder="99999-999" maxLength={8} />
          ) : (
            <p className="font-medium">{address.zipcode}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-foreground">Cidade</Label>
          {isEditing ? (
            <Input name="city" value={editData.city} onChange={handleInputChange} />
          ) : (
            <p className="font-medium">{address.city}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label className="text-foreground">Estado</Label>
          {isEditing ? (
            <Select value={editData.state} onValueChange={handleStateChange}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {states.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : (
            <p className="font-medium">{address.state}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-foreground">Bairro</Label>
          {isEditing ? (
            <Input name="neighborhood" value={editData.neighborhood} onChange={handleInputChange} />
          ) : (
            <p className="font-medium">{address.neighborhood}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-foreground">Endereço</Label>
          {isEditing ? (
            <Input name="street" value={editData.street} onChange={handleInputChange} />
          ) : (
            <p className="font-medium">{address.street}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="text-foreground">Número</Label>
          {isEditing ? (
            <Input name="number" value={editData.number} onChange={handleInputChange} />
          ) : (
            <p className="font-medium">{address.number}</p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className="text-foreground">Complemento</Label>
          {isEditing ? (
            <Input name="complement" value={editData.complement || ""} onChange={handleInputChange} />
          ) : (
            <p className="font-medium">{address.complement || "N/A"}</p>
          )}
        </div>

        {isEditing && (
          <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
            <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "A salvar..." : "Salvar Endereço"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}