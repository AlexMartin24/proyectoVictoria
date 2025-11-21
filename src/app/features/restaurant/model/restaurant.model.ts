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
  enabled: boolean; // Indica si el restaurante está activo o no
  openingHours?: string; // Horario de apertura
  slug: string; // ← slug para URLs
  membershipType: boolean; // Indica si el restaurante tiene membresía premium
  ownerId: string[]; // ID del usuario propietario del restaurante
  createdAt: Date;
  updatedAt?: Date;
}

export type RestaurantDialogMode = 'edit' | 'create';

export interface RestaurantDialogData {
  restaurant: Restaurant;
  mode: RestaurantDialogMode;
}

export const RESTAURANT_COLLECTION = 'restaurants';
