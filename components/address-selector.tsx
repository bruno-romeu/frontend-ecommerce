"use client";

import { SavedAddress } from "@/app/checkout/page";
import { Button } from "./ui/button";

interface AddressSelectorProps {
  addresses: SavedAddress[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
  onAddNew: () => void;
}

export function AddressSelector({ addresses, selectedAddressId, onSelectAddress, onAddNew }: AddressSelectorProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold font-serif mb-4">Selecione um Endereço de Entrega</h2>
      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => onSelectAddress(address.id)}
            className={`p-4 border rounded-md cursor-pointer transition-all ${
              selectedAddressId === address.id
                ? 'border-primary ring-2 ring-primary'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <p className="font-semibold">{`${address.street}, ${address.number}`}</p>
            <p className="text-sm text-default">{`${address.city}, ${address.state} - ${address.zipcode}`}</p>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={onAddNew} className="w-full mt-4">
        Adicionar Novo Endereço
      </Button>
    </div>
  );
}