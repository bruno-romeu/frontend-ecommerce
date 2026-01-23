export interface Category {
    id: number;
    name: string;
    slug: string;
    customization_options: string[];
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
    sensory_profile: string | null;
    notes: string | null;
    ambient: string | null
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

export interface ProductCustomization {
    id: number;
    type_choices: string[];
    category: Category;
    name: string;
    instruction: string | null;
    input_type: string | null;
    available_options: string[];
    price_extra: number | null;
    free_above_quantity: number | null;

}

export interface AvailableOptions {
    sizes: Size[];
    essences: Essence[];
    customizations: ProductCustomization[];
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
