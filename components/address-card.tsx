"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/client/utils/states/');
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/client/addresses/${address.id}/`);
      // Recarregar a página para atualizar a lista
      window.location.reload();
    } catch (error) {
      console.error("Falha ao deletar endereço:", error);
      alert("Não foi possível deletar o endereço. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setEditData(address);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="border-primary/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Editar Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor={`zipcode-${address.id}`} className="text-xs">CEP</Label>
              <Input
                id={`zipcode-${address.id}`}
                name="zipcode"
                value={editData.zipcode}
                onChange={handleInputChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`city-${address.id}`} className="text-xs">Cidade</Label>
              <Input
                id={`city-${address.id}`}
                name="city"
                value={editData.city}
                onChange={handleInputChange}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`state-${address.id}`} className="text-xs">Estado</Label>
              <Select value={editData.state} onValueChange={handleStateChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor={`neighborhood-${address.id}`} className="text-xs">Bairro</Label>
              <Input
                id={`neighborhood-${address.id}`}
                name="neighborhood"
                value={editData.neighborhood}
                onChange={handleInputChange}
                className="h-9"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor={`street-${address.id}`} className="text-xs">Rua / Avenida</Label>
              <Input
                id={`street-${address.id}`}
                name="street"
                value={editData.street}
                onChange={handleInputChange}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`number-${address.id}`} className="text-xs">Número</Label>
              <Input
                id={`number-${address.id}`}
                name="number"
                value={editData.number}
                onChange={handleInputChange}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`complement-${address.id}`} className="text-xs">Complemento</Label>
              <Input
                id={`complement-${address.id}`}
                name="complement"
                value={editData.complement || ""}
                onChange={handleInputChange}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Endereço de Entrega</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir endereço?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O endereço será permanentemente removido da sua conta.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex flex-col gap-1">
          <p className="font-medium">
            {address.street}, {address.number}
            {address.complement && ` - ${address.complement}`}
          </p>
          <p className="text-sm font-semibold">
            {address.neighborhood}
          </p>
          <p className="text-sm font-semibold">
            {address.city} - {address.state}
          </p>
          <p className="text-sm font-semibold">
            CEP: {address.zipcode}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}