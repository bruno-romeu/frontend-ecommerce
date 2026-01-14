"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { AddressCard } from "./address-card";
import { OrdersList, type Order } from "./order-list";
import api from "@/lib/api";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface StateOption {
  value: string;
  label: string;
}

interface NewAddressData {
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

export function ProfileContent({
  activeTab,
  profile,
  addresses,
  onProfileUpdate,
  onAddressUpdate,
}: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditFormData>({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados para adicionar novo endereço
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<NewAddressData>({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipcode: "",
    complement: "",
  });
  const [states, setStates] = useState<StateOption[]>([]);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    setEditData({
      name: `${profile.first_name} ${profile.last_name}`,
      cpf: profile.cpf || "",
      phone_number: profile.phone_number || "",
      birthday: profile.birthday || "",
    });
  }, [profile, isEditing]);

  useEffect(() => {
    if (activeTab === "pedidos") {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get('/client/utils/states/');
        setStates(response.data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };
    fetchStates();
  }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const response = await api.get("order/order-list/");
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
    } catch (error: any) {
      console.error("Erro ao carregar pedidos:", error);
      setOrdersError("Falha ao carregar pedidos. Tente novamente.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) {
      return;
    }

    try {
      await api.patch(`order/order-cancel/${orderId}/`, {
        status: "canceled",
      });
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: "canceled" } : o
        )
      );
    } catch (error: any) {
      console.error("Erro ao cancelar pedido:", error);
      alert("Não foi possível cancelar este pedido.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { cpf, phone_number } = editData;
    if (cpf && cpf.trim() !== "") {
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length !== 11) {
        newErrors.cpf = "O CPF deve conter 11 digitos.";
      }
    }

    if (phone_number && phone_number.trim() !== "") {
      const phoneDigits = phone_number.replace(/\D/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        newErrors.phone_number = "O telefone deve conter 10 ou 11 dígitos (com DDD).";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrors({});

    const nameParts = editData.name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    const payload = {
      first_name: firstName,
      last_name: lastName || firstName,
      cpf: editData.cpf,
      phone_number: editData.phone_number,
      birthday: editData.birthday,
    };

    try {
      const response = await api.patch("/client/profile/", payload);
      onProfileUpdate(response.data);
      setIsEditing(false);
    } catch (error: any) {
      console.error("Falha ao atualizar dados do perfil: ", error);

      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ form: "Ocorreu um erro inesperado." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Função para verificar se o endereço é duplicado
  const isDuplicateAddress = (newAddr: NewAddressData): boolean => {
    return addresses.some(
      (addr) =>
        addr.street.toLowerCase() === newAddr.street.toLowerCase() &&
        addr.number === newAddr.number &&
        addr.neighborhood.toLowerCase() === newAddr.neighborhood.toLowerCase() &&
        addr.city.toLowerCase() === newAddr.city.toLowerCase() &&
        addr.state === newAddr.state &&
        addr.zipcode.replace(/\D/g, "") === newAddr.zipcode.replace(/\D/g, "")
    );
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (addressErrors[name]) {
      setAddressErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddressStateChange = (value: string) => {
    setNewAddress((prev) => ({ ...prev, state: value }));
    if (addressErrors.state) {
      setAddressErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.state;
        return newErrors;
      });
    }
  };

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
      setNewAddress(prev => ({
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

  const validateNewAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newAddress.zipcode.trim()) {
      newErrors.zipcode = "CEP é obrigatório";
    } else if (newAddress.zipcode.replace(/\D/g, "").length !== 8) {
      newErrors.zipcode = "CEP deve ter 8 dígitos";
    }

    if (!newAddress.street.trim()) {
      newErrors.street = "Rua é obrigatória";
    }

    if (!newAddress.number.trim()) {
      newErrors.number = "Número é obrigatório";
    }

    if (!newAddress.neighborhood.trim()) {
      newErrors.neighborhood = "Bairro é obrigatório";
    }

    if (!newAddress.city.trim()) {
      newErrors.city = "Cidade é obrigatória";
    }

    if (!newAddress.state.trim()) {
      newErrors.state = "Estado é obrigatório";
    }

    // Verificar se é duplicado
    if (Object.keys(newErrors).length === 0 && isDuplicateAddress(newAddress)) {
      newErrors.form = "Este endereço já está cadastrado";
    }

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = async () => {
    if (!validateNewAddress()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/client/address/create/', newAddress);
      
      // Adicionar o novo endereço à lista
      window.location.reload(); // Recarregar para atualizar a lista de endereços
      
      // Resetar formulário e fechar modal
      setNewAddress({
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        zipcode: "",
        complement: "",
      });
      setIsAddingAddress(false);
    } catch (error: any) {
      console.error("Erro ao adicionar endereço:", error);
      if (error.response && error.response.data) {
        setAddressErrors(error.response.data);
      } else {
        setAddressErrors({ form: "Ocorreu um erro ao adicionar o endereço." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="md:col-span-3">
      {activeTab === "dados" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Informações Pessoais</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm pt-4">
              <div className="space-y-1 md:col-span-2">
                <Label className="text-foreground">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="font-medium">
                    {profile.first_name} {profile.last_name}
                  </p>
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
                    <Input
                      name="phone_number"
                      maxLength={11}
                      value={editData.phone_number || ""}
                      onChange={handleInputChange}
                      className={
                        errors.phone_number ? "border-destructive" : ""
                      }
                    />
                    {errors.phone_number && (
                      <p className="text-xs text-destructive">
                        {errors.phone_number}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-medium">
                    {profile.phone_number || "Não informado"}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">CPF</Label>
                {isEditing ? (
                  <>
                    <Input
                      name="cpf"
                      placeholder="XXX.XXX.XXX-XX"
                      maxLength={11}
                      value={editData.cpf || ""}
                      onChange={handleInputChange}
                      className={errors.cpf ? "border-destructive" : ""}
                    />
                    {errors.cpf && (
                      <p className="text-xs text-destructive">{errors.cpf}</p>
                    )}
                  </>
                ) : (
                  <p className="font-medium">{profile.cpf || "Não informado"}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Data de Nascimento</Label>
                {isEditing ? (
                  <Input
                    name="birthday"
                    type="date"
                    value={editData.birthday || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="font-medium">
                    {profile.birthday || "Não informado"}
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="md:col-span-2 flex justify-end space-x-2 pt-4">
                  <Button variant="ghost" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? "A salvar..." : "Salvar Alterações"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seção de Endereços */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Endereços de Entrega</CardTitle>
              <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Endereço
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Endereço</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo endereço de entrega
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-zipcode">CEP *</Label>
                      <Input
                        id="new-zipcode"
                        name="zipcode"
                        value={newAddress.zipcode}
                        onChange={handleAddressInputChange}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        maxLength={9}
                        className={addressErrors.zipcode ? "border-destructive" : ""}
                      />
                      {addressErrors.zipcode && (
                        <p className="text-xs text-destructive">{addressErrors.zipcode}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-city">Cidade *</Label>
                        <Input
                          id="new-city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressInputChange}
                          className={addressErrors.city ? "border-destructive" : ""}
                        />
                        {addressErrors.city && (
                          <p className="text-xs text-destructive">{addressErrors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-state">Estado *</Label>
                        <Select value={newAddress.state} onValueChange={handleAddressStateChange}>
                          <SelectTrigger className={addressErrors.state ? "border-destructive" : ""}>
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
                        {addressErrors.state && (
                          <p className="text-xs text-destructive">{addressErrors.state}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-neighborhood">Bairro *</Label>
                      <Input
                        id="new-neighborhood"
                        name="neighborhood"
                        value={newAddress.neighborhood}
                        onChange={handleAddressInputChange}
                        className={addressErrors.neighborhood ? "border-destructive" : ""}
                      />
                      {addressErrors.neighborhood && (
                        <p className="text-xs text-destructive">{addressErrors.neighborhood}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-street">Rua / Avenida *</Label>
                      <Input
                        id="new-street"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressInputChange}
                        className={addressErrors.street ? "border-destructive" : ""}
                      />
                      {addressErrors.street && (
                        <p className="text-xs text-destructive">{addressErrors.street}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-number">Número *</Label>
                        <Input
                          id="new-number"
                          name="number"
                          value={newAddress.number}
                          onChange={handleAddressInputChange}
                          className={addressErrors.number ? "border-destructive" : ""}
                        />
                        {addressErrors.number && (
                          <p className="text-xs text-destructive">{addressErrors.number}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-complement">Complemento</Label>
                        <Input
                          id="new-complement"
                          name="complement"
                          value={newAddress.complement || ""}
                          onChange={handleAddressInputChange}
                        />
                      </div>
                    </div>

                    {addressErrors.form && (
                      <p className="text-sm text-destructive text-center">{addressErrors.form}</p>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsAddingAddress(false);
                          setNewAddress({
                            street: "",
                            number: "",
                            neighborhood: "",
                            city: "",
                            state: "",
                            zipcode: "",
                            complement: "",
                          });
                          setAddressErrors({});
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddAddress} disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar Endereço"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="pt-4">
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-black">
                  <p>Você ainda não tem endereços cadastrados.</p>
                  <p className="text-sm text-black mt-2">Adicione um endereço para facilitar suas compras.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onUpdate={onAddressUpdate}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "pedidos" && (
        <div>
          {ordersLoading ? (
            <Card>
              <CardContent className="flex justify-center py-12">
                <p className="text-default">
                  Carregando pedidos...
                </p>
              </CardContent>
            </Card>
          ) : ordersError ? (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="py-4">
                <p className="text-destructive text-sm">{ordersError}</p>
                <Button
                  onClick={fetchOrders}
                  size="sm"
                  className="mt-2"
                  variant="outline"
                >
                  Tentar Novamente
                </Button>
              </CardContent>
            </Card>
          ) : (
            <OrdersList orders={orders} onCancel={handleCancelOrder} />
          )}
        </div>
      )}
    </main>
  );
}