import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../../products/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  constructor(private firestore: Firestore) {}

  private generateSlugBase(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateUniqueSlug(
    name: string,
    ignoreId?: string
  ): Promise<string> {
    const base = this.generateSlugBase(name);
    const q = query(
      collection(this.firestore, 'restaurants'),
      where('slug', '>=', base)
    );
    const snapshot = await getDocs(q);

    // Ignorar el propio restaurante al chequear slugs
    const slugs = snapshot.docs
      .filter((d) => d.id !== ignoreId)
      .map((d) => d.data()['slug']);

    if (!slugs.includes(base)) return base;

    let counter = 1;
    let newSlug = `${base}-${counter}`;
    while (slugs.includes(newSlug)) {
      counter++;
      newSlug = `${base}-${counter}`;
    }

    return newSlug;
  }

  /* ========================= CREATE ========================= */
  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    const slug = await this.generateUniqueSlug(data.name!);

    const docRef = await addDoc(collection(this.firestore, 'restaurants'), {
      ...data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      ...data,
      restaurantId: docRef.id,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Restaurant;
  }

  /* ========================= READ ========================= */
  getRestaurantBySlug(slug: string): Observable<Restaurant | null> {
    const q = query(
      collection(this.firestore, 'restaurants'),
      where('slug', '==', slug)
    );
    return new Observable((sub) => {
      const unsubscribe = onSnapshot(q, (snap) => {
        if (snap.empty) {
          sub.next(null);
          return;
        }
        const d = snap.docs[0].data() as any;
        sub.next({
          restaurantId: snap.docs[0].id,
          ...d,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
          updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate() : null,
        });
      });
      return () => unsubscribe();
    });
  }

  /* ==================== READ RESTAURANTS BY STATUS ========================= */

  getRestaurantsByStatus(enabled: boolean): Observable<Restaurant[]> {
    const q = query(
      collection(this.firestore, 'restaurants'),
      where('enabled', '==', enabled)
    );
    return new Observable((sub) => {
      const unsubscribe = onSnapshot(q, (snap) => {
        const restaurants = snap.docs.map((d) => ({
          restaurantId: d.id,
          ...d.data(),
        })) as Restaurant[];
        sub.next(restaurants);
      });
      return () => unsubscribe();
    });
  }

  /* ========================= UPDATE ========================= */
  async updateRestaurantData(
    restaurantId: string,
    updatedData: Partial<Restaurant>
  ): Promise<void> {
    const restaurantRef = doc(this.firestore, `restaurants/${restaurantId}`);
    const payload: any = { ...updatedData, updatedAt: new Date() };

    if (updatedData.name) {
      payload.slug = await this.generateUniqueSlug(
        updatedData.name,
        restaurantId
      );
    }

    await updateDoc(restaurantRef, payload);
  }

  /* ========================= PRODUCTS ========================= */
  getProductsByRestaurant(restaurantId?: string): Observable<Product[]> {
    if (!restaurantId) return new Observable((sub) => sub.next([]));
    const productsRef = collection(
      this.firestore,
      `restaurants/${restaurantId}/products`
    );
    return new Observable((sub) => {
      const unsubscribe = onSnapshot(productsRef, (snap) => {
        const products = snap.docs.map((d) => ({
          productId: d.id,
          ...d.data(),
        })) as Product[];
        sub.next(products);
      });
      return () => unsubscribe();
    });
  }

  /** Deshabilitar */
  async disableRestaurant(restaurantId: string) {
    await updateDoc(doc(this.firestore, `restaurants/${restaurantId}`), {
      enabled: false,
      updatedAt: new Date(),
    });
  }

  /** Habilitar */
  async enableRestaurant(restaurantId: string) {
    await updateDoc(doc(this.firestore, `restaurants/${restaurantId}`), {
      enabled: true,
      updatedAt: new Date(),
    });
  }
}
