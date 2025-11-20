export interface Restaurant {
  restaurantId: string;
  name: string;
  address: string;
  addressNumber: number;
  description?: string;
  imageLogo?: string;
  mainImage?: string;
  phone?: string;
  rating?: number; // Calificación promedio del restaurante
  enabled: boolean; // Indica si el restaurante dado de alta o baja
  openingHours?: string; // Horario de apertura
  createdAt: Date;
  updatedAt?: Date;
}

export type RestaurantDialogMode = 'edit' | 'create';

export interface RestaurantDialogData {
  restaurant: Restaurant;
  mode: RestaurantDialogMode;
}


export const RESTAURANT_COLLECTION = 'restaurants';
