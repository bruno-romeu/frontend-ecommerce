"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    cpf?: string;
    phone_number?: string;
    birthday?: string;
}

interface RegisterData {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
            const initializeAuth = async () => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    try {
                        const response = await api.get('/auth/users/me/');
                        setUser(response.data);
                    } catch (error) {
                        console.warn("Acess expirado, tentando Refresh...");
                        try {
                            const refresh = localStorage.getItem('refreshToken');
                            if (!refresh) throw new Error("Sem refresh token");

                            const refreshResponse = await api.post('/auth/jwt/refresh/', { refresh });
                            const newAccess = refreshResponse.data.access;

                            localStorage.setItem('accessToken', newAccess);
                            api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;

                            const userResponse = await api.get('/auth/users/me/');
                            setUser(userResponse.data);

                        } catch (refreshError) {
                            console.error("Refresh falhou, limpando login...");
                            localStorage.removeItem('accessToken');
                            delete api.defaults.headers.common['Authorization'];
                            setUser(null);
                        }
                    }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/jwt/create/', { email, password });
            const { access, refresh } = response.data;
            
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            const userResponse = await api.get('/auth/users/me/');
            setUser(userResponse.data);

            router.push('/perfil');
        } catch (error) {
            console.error('Falha no login:', error);
            throw new Error('Email ou senha inválidos.');
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            await api.post('/client/register/', userData);
            
            alert("Conta criada com sucesso! Por favor, faça o login.");
            router.push('/login');

        } catch (error) {
            console.error('Falha no registo:', error);
            throw error; 
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, loading }}>
        {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};