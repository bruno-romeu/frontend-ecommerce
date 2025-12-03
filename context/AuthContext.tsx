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
    email_verified?: boolean;
}

interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password2: string; 
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await api.get('/auth/users/me/');
                setUser(response.data);
            } catch (error: unknown) {
                if (isAxiosError(error) && error.response?.status === 401) {
                    console.log("Usuário não autenticado");
                } else {
                    console.error("Erro ao verificar autenticação:", error);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        
        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await api.post('/client/auth/jwt/create/', { email, password });
            const userResponse = await api.get('/auth/users/me/');
            setUser(userResponse.data);
            router.push('/perfil');
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                if (error.response?.status === 403) {
                    const errorData = error.response.data;
                    sessionStorage.setItem('registration_email', email);
                    const customError = new Error(
                        errorData.error || 'Email não verificado. Por favor, verifique seu email antes de fazer login.'
                    );
                    (customError as any).response = error.response;
                    throw customError;
                }

                console.error('Falha no login:', error.response?.data?.detail || error.message);
                throw new Error(error.response?.data?.detail || 'Email ou senha inválidos.');
            } else {
                console.error('Falha no login:', (error as Error).message);
            }
            if (isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Email ou senha inválidos.');
            }
            throw new Error('Email ou senha inválidos.');
        }
    };

    const register = async (userData: RegisterData) => {
        try {
            await api.post('/client/register/', userData);
            sessionStorage.setItem('registration_email', userData.email);
            router.push('/verificacao-enviada');
        } catch (error: unknown) {
            console.error('Falha no registro:', error);
            throw error; 
        }
    };

    const logout = async () => {
        try {
            await api.post('/client/auth/logout/');
        } catch (error: unknown) {
            console.error('Erro no logout:', error);
        } finally {
            setUser(null);
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated: !!user, 
            user, 
            login, 
            register, 
            logout, 
            loading 
        }}>
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