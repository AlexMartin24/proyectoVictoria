export interface Restaurante {
  id?: string;
  name: string;
  address?: string;
  adressNumber?: number;
  description?: string;
  imageUrl?: string;
  phone?: string;
  rating?: number; // Calificación promedio del restaurante
  createdAt: Date;
  updatedAt?: Date;
}

export const RESTAURANT_COLLECTION = 'restaurants';