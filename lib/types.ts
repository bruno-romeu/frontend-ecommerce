export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Size {
    id: number;
    name: string;
    weight: number;
    unit:string;
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

export interface Product {
    id: number;
    slug: string;
    name: string;
    price: string | number;
    size: Size | null;
    essence: Essence | null;
    image?: string | null; 
    rating?: number;
    reviewCount?: number;
    category?: string; 
    short_description?: string;
    full_description?: string;
    stock_quantity: number;
    stock?: boolean;
    is_bestseller: boolean;
}

export interface AvailableOptions {
    sizes: Size[];
    essences: Essence[];
}

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    birthday: Date | null;
    cpf: string | null;
    phone: string | null;
}
