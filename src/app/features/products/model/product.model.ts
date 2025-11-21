export interface Product {
  productId: string;
  name: string;
  price: number;
  available: boolean;
  description?: string;
  imageUrl?: string;
  category?: string;
  isOffer?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const PRODUCT_CATEGORIES = [
  'Entradas',
  'Platos principales',
  'Bebidas',
  'Postres',
];
