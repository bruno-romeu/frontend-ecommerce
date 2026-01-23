"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext'; 
import { Product } from '@/lib/types';

export interface CustomizationPayload {
    option_id: number;
    value: string;
}

export interface CartItemCustomization {
    id: number;
    option_name: string; 
    value: string; 
    price_extra: number; 
}

export interface Essence {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    image_url: string | null;
    order: number;
    slug: string;
}

interface CartItem extends Product {
    cart: number;
    cartItemId: number;
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
    essence: Essence | null;
    customizations: CartItemCustomization[];
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (
        product: Product, 
        quantity: number, 
        essenceId: number | null, 
        customizations?: CustomizationPayload[] 
    ) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>; 
    updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
    total: number;
    cartItemCount: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth(); 

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await api.get('/cart/my-cart/');
            
            const formattedItems: CartItem[] = response.data.items.map((item: any) => ({
                cart: item.cart,
                cartItemId: item.id,
                product_id: item.product_id || item.product.id,
                quantity: item.quantity,
                name: item.product?.name ?? "Produto Indisponível",
                price: parseFloat(item.product?.price ?? "0"),
                image: item.product?.image ?? "",
                essence: item.essence ? {
                    id: item.essence.id,
                    name: item.essence.name,
                    image_url: item.essence.image,
                    description: item.essence.description,
                    is_active: true,
                    order: 0,
                    slug: item.essence.slug
                } : null,
                customizations: item.customizations ? item.customizations.map((c: any) => ({
                    id: c.id,
                    option_name: c.option.name, 
                    value: c.value,
                    price_extra: parseFloat(c.option.price_extra || "0")
                })) : []
            }));
            
            setCartItems(formattedItems);
        } catch (error) {
            console.error("Não foi possível buscar o carrinho:", error);
            setCartItems([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartItems([]);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const addToCart = async (
        product: Product, 
        quantity: number, 
        essenceId: number | null, 
        customizations: CustomizationPayload[] = []
    ) => {
        if (!isAuthenticated) {
            alert("Por favor, faça login para adicionar itens ao carrinho.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/cart/items/add/', {
                product: product.id,  
                quantity: quantity,
                essence: essenceId,   
                customizations: customizations 
            });
            
            await fetchCart();
        } catch (error) {
            console.error("Erro ao adicionar item ao carrinho:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        setLoading(true);
        try {
            await api.delete(`/cart/items/delete/${cartItemId}/`); 
            
            setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
            
            await fetchCart(); 
        } catch (error) {
            console.error("Erro ao remover item:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: number, quantity: number) => {
        if (quantity < 1) {
            await removeFromCart(cartItemId);
            return;
        }
        setLoading(true);
        try {
            await api.patch(`/cart/items/${cartItemId}/`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
        } finally {
            setLoading(false);
        }
    };

    const total = cartItems.reduce((sum, item) => {
        return sum + (+item.price * item.quantity); 
    }, 0);

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, total, cartItemCount, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};