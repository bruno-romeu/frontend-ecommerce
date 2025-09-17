"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext'; 
import { Product } from '@/lib/types';

interface CartItemAPI {
    id: number;
    product: number;
    quantity: number;
}

interface CartItem extends Product {
    cart: number;
    cartItemId: number;
    product_id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number) => Promise<void>;
    removeFromCart: (product_id: number) => Promise<void>;
    updateQuantity: (product_id: number, quantity: number) => Promise<void>;
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
            const formattedItems = response.data.items.map((item: any) => ({
                cart: item.cart,
                cartItemId: item.id,
                product_id: item.product_id,
                quantity: item.quantity,
                name: item.product?.name ?? "",
                price: item.product?.price ?? 0,
                image: item.product?.image ?? "",
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

    const addToCart = async (product: Product, quantity: number) => {
        if (!isAuthenticated) {
            alert("Por favor, faça login para adicionar itens ao carrinho.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/cart/items/add/', {
                product_id: product.id,
                quantity: quantity,
            });
            await fetchCart();
        } catch (error) {
            console.error("Erro ao adicionar item ao carrinho:", error);
        } finally {
            setLoading(false);
        }
    };

    // Altere as funções para usar cartItemId
    const removeFromCart = async (cartItemId: number) => {
        setLoading(true);
        try {
            await api.delete(`/cart/item/remove/${cartItemId}/`);
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
            await api.patch(`/cart/items/update/${cartItemId}/`, { quantity });
            await fetchCart();
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
        } finally {
            setLoading(false);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + (+item.price * item.quantity), 0);
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