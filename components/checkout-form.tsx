"use client";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react";
import api from "@/lib/api";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  setFormData: (data: CheckoutFormData) => void;
  onCepBlur: (cep: string) => void;
}

interface StateOption {
  value: string;
  label: string;
}

export function CheckoutForm({ formData, setFormData, onCepBlur}: CheckoutFormProps) {
  const [states, setStates] = useState<StateOption[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/client/utils/states/');
        setStates(response.data);
      } catch (error) {
        console.error("Erro ao buscar a lista de estados:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold font-serif">Informações de Contato</h2>
        <p className="text-sm text-muted-foreground mt-1">Para quem enviaremos a confirmação do pedido.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Seu nome" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apelido</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Seu apelido" required />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-xl font-semibold font-serif">Endereço de Entrega</h2>
        <p className="text-sm text-muted-foreground mt-1">Onde você quer receber sua encomenda.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} 
          onBlur={(e) => onCepBlur(e.target.value)} placeholder="99999-999"  required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="street">Rua / Avenida</Label>
          <Input id="street" name="street" value={formData.street} onChange={handleChange} placeholder="Nome da sua rua" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input id="number" name="number" value={formData.number} onChange={handleChange} placeholder="123" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento (Opcional)</Label>
            <Input id="complement" name="complement" value={formData.complement} onChange={handleChange} placeholder="Apto, bloco, etc." />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Seu bairro" required />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Sua cidade" required />
          </div>
          <div className="space-y-2">
    <Label htmlFor="state">Estado</Label>
    <select
        id="state"
        name="state"
        value={formData.state}
        onChange={handleChange}
        disabled={isLoadingStates}
        required
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
        <option value="" disabled>
            {isLoadingStates ? 'Carregando...' : 'Selecione um estado'}
        </option>
        {states.map((stateOption) => (
            <option key={stateOption.value} value={stateOption.value}>
                {stateOption.label}
            </option>
        ))}
    </select>
</div>
        </div>
      </div>
    </div>
  );
}