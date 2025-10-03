"use client"

import { useState, useEffect } from "react";
import { CheckoutForm, CheckoutFormData } from "@/components/checkout-form";
import { CheckoutSummary } from "@/components/checkout-summary";
import { AddressSelector } from "@/components/address-selector";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext"; 

export interface SavedAddress {
  id: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  complement?: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    cpf: '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '', zipCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/client/addresses/');
        setSavedAddresses(response.data);
        if (response.data.length === 0) {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error("Erro ao buscar endereços:", err);
        setShowNewAddressForm(true); // Mostra o formulário em caso de erro
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleCepBlur = async (cepValue: string) => {
    const cep = cepValue.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        console.error("CEP não encontrado.");
        return;
      }
      setFormData(prev => ({
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


  const isFormValid = () => {
    return !!(formData.firstName && formData.lastName && formData.email && formData.cpf && formData.street && formData.number && formData.neighborhood && formData.city && formData.state && formData.zipCode);
  };

  const handleFinalizePurchase = async () => {
    setIsLoading(true);
    setError(null);
    let addressIdToUse = selectedAddressId;

    try {
      // Se um novo endereço está a ser criado, executamos o Passo 1
      if (showNewAddressForm) {
        if (!isFormValid()) {
          setError("Por favor, preencha todos os campos do novo endereço.");
          setIsLoading(false);
          return;
        }
        console.log("Passo 1: Criando novo endereço...");
        const addressResponse = await api.post('/client/address/create/', {
          street: formData.street, number: formData.number, complement: formData.complement,
          neighborhood: formData.neighborhood, city: formData.city, state: formData.state, zipcode: formData.zipCode,
        });
        addressIdToUse = addressResponse.data.id;
        console.log(`Endereço ${addressIdToUse} criado.`);
      }

      if (!addressIdToUse) {
        setError("Por favor, selecione ou adicione um endereço de entrega.");
        setIsLoading(false);
        return;
      }

      // Passo 2: Criar o Pedido
      console.log(`Passo 2: Criando pedido com endereço ID ${addressIdToUse}...`);
      const orderResponse = await api.post('/order/order-create/', { address: addressIdToUse });
      const newOrderId = orderResponse.data.id;

      // Passo 3: Criar o Pagamento
      console.log(`Passo 3: Criando pagamento para pedido ID ${newOrderId}...`);
      const paymentResponse = await api.post('/checkout/payments/create/', { order: newOrderId });
      
      setPreferenceId(paymentResponse.data.preference_id);

    } catch (err) {
      console.error("Erro no fluxo de checkout:", err);
      setError("Não foi possível processar seu pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
      


   return (
    <div className="min-h-screen flex flex-col">
      <main className="py-8 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Finalizar Compra</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CORREÇÃO 3: Lógica de exibição condicional */}
            <div className="lg:col-span-2 space-y-8">
              {isLoadingAddresses ? (
                <p>Carregando endereços...</p>
              ) : (
                <>
                  {savedAddresses.length > 0 && !showNewAddressForm && (
                    <AddressSelector
                      addresses={savedAddresses}
                      selectedAddressId={selectedAddressId}
                      onSelectAddress={setSelectedAddressId}
                      onAddNew={() => {
                        setShowNewAddressForm(true);
                        setSelectedAddressId(null);
                      }}
                    />
                  )}
                  {showNewAddressForm && (
                    <CheckoutForm formData={formData} setFormData={setFormData} 
                    onCepBlur={handleCepBlur}/>
                  )}
                </>
              )}
            </div>
            <div className="lg:col-span-1">
              <CheckoutSummary 
                handlePayment={handleFinalizePurchase}
                isLoading={isLoading}
                preferenceId={preferenceId}
                error={error}
                isFormValid={showNewAddressForm ? isFormValid() : !!selectedAddressId}
                isCheckoutPage={true}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}