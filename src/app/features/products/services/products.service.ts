import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  
  constructor(private firestore: Firestore) {}

  /**
   * Obtiene todos los productos del restaurante (para dashboard admin)
   */
  getAllProductsFromRestaurant(restaurantId: string): Observable<Product[]> {
    const productsRef = collection(
      this.firestore,
      `restaurants/${restaurantId}/products`
    );

    // Firestore ya devuelve los strings exactamente como están guardados
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Obtiene productos disponibles filtrados por categoría (para menú del cliente)
   */
  getAvailableProductsByCategory(
    restaurantId: string,
    category: string
  ): Observable<Product[]> {
    const productsRef = collection(
      this.firestore,
      `restaurants/${restaurantId}/products`
    );

    const q = query(productsRef, where('category', '==', category), where('available', '==', true));

    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

    /**
   * Agrega un nuevo producto a un restaurante
   * @param restaurantId Id del restaurante
   * @param product Producto a agregar
   */
  addProduct(restaurantId: string, product: Product): Promise<void> {
    const productsRef = collection(
      this.firestore,
      `restaurants/${restaurantId}/products`
    );

    // Generamos un nuevo documento con ID automático
    return addDoc(productsRef, {
      ...product,
      available: product.available ?? true, // por defecto disponible
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).then(() => {
      console.log('Producto agregado correctamente');
    }).catch((error) => {
      console.error('Error al agregar el producto:', error);
      throw error;
    });
  }

}
