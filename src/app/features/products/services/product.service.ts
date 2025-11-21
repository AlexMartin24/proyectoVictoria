import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
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
    return collectionData(productsRef, { idField: 'id' }) as Observable<
      Product[]
    >;
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

    const q = query(
      productsRef,
      where('category', '==', category),
      where('available', '==', true)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Obtiene productos disponibles filtrados por ofertas (para menú del cliente)
   */

  getOfferProducts(restaurantId: string): Observable<Product[]> {
    const productsRef = collection(
      this.firestore,
      `restaurants/${restaurantId}/products`
    );

    const q = query(
      productsRef,
      where('available', '==', true),
      where('isOffer', '==', true)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }


  /* ========================= CREATE ========================= */
async createProduct(data: Partial<Product> & { restaurantId: string }): Promise<Product> {
  if (!data.restaurantId) {
    throw new Error('restaurantId es obligatorio para crear un producto');
  }

  const now = new Date();

  const productsRef = collection(
    this.firestore,
    `restaurants/${data.restaurantId}/products`
  );

  const docRef = await addDoc(productsRef, {
    ...data,
    available: data.available ?? true, // valor por defecto
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...data,
    productId: docRef.id,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  } as Product;
}

      /* ========================= UPDATE ========================= */
async updateProductData(
  restaurantId: string,
  productId: string,
  updatedData: Partial<Product>
): Promise<void> {
  const productRef = doc(
    this.firestore,
    `restaurants/${restaurantId}/products/${productId}`
  );

  const payload: any = {
    ...updatedData,
    updatedAt: new Date(),
  };

  await updateDoc(productRef, payload);
}


async disableProduct(restaurantId: string, productId: string) {
  const productRef = doc(
    this.firestore,
    `restaurants/${restaurantId}/products/${productId}`
  );

  await updateDoc(productRef, {
    available: false,
    updatedAt: new Date(),
  });
}

async enableProduct(restaurantId: string, productId: string) {
  const productRef = doc(
    this.firestore,
    `restaurants/${restaurantId}/products/${productId}`
  );

  await updateDoc(productRef, {
    available: true,
    updatedAt: new Date(),
  });
}


}
