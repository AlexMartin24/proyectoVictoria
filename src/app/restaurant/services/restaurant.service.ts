import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  updateDoc,
  addDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Restaurant } from '../model/restaurant.model';
import { Product } from '../../products/model/product.model';
import { serverTimestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  constructor(private firestore: Firestore) {}

  /* =========================================================
     SLUG HELPERS
  ========================================================= */

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

    // Busco todos los slugs que comiencen parecido
    const q = query(
      collection(this.firestore, 'restaurants'),
      where('slug', '>=', base)
    );

    const snapshot = await getDocs(q);
    const slugs = snapshot.docs
      .filter((d) => d.id !== ignoreId)
      .map((d) => d.data()['slug']);

    if (!slugs.includes(base)) return base;

    let count = 1;
    let newSlug = `${base}-${count}`;
    while (slugs.includes(newSlug)) {
      count++;
      newSlug = `${base}-${count}`;
    }
    return newSlug;
  }

  /* =========================================================
     CREATE
  ========================================================= */

  createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    return (async () => {
      const slug = await this.generateUniqueSlug(data.name!);

      const ref = await addDoc(collection(this.firestore, 'restaurants'), {
        ...data,
        slug,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        ...data,
        restaurantId: ref.id,
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Restaurant;
    })();
  }

  /* =========================================================
     READ
  ========================================================= */

  getRestaurantBySlug(slug: string): Observable<Restaurant | null> {
    const q = query(
      collection(this.firestore, 'restaurants'),
      where('slug', '==', slug)
    );

    return collectionData(q, { idField: 'restaurantId' }).pipe(
      map((items: any[]) => {
        if (!items.length) return null;

        const r = items[0];
        return {
          ...r,
          createdAt: r.createdAt?.toDate ? r.createdAt.toDate() : r.createdAt,
          updatedAt: r.updatedAt?.toDate ? r.updatedAt.toDate() : r.updatedAt,
        } as Restaurant;
      })
    );
  }

  getRestaurantsByStatus(enabled: boolean): Observable<Restaurant[]> {
    const q = query(
      collection(this.firestore, 'restaurants'),
      where('enabled', '==', enabled)
    );

    return collectionData(q, { idField: 'restaurantId' }) as Observable<
      Restaurant[]
    >;
  }

  /* =========================================================
     UPDATE
  ========================================================= */

  updateRestaurantData(
    restaurantId: string,
    updated: Partial<Restaurant>
  ): Promise<void> {
    return (async () => {
      const ref = doc(this.firestore, `restaurants/${restaurantId}`);

      const payload: any = {
        ...updated,
        updatedAt: serverTimestamp(),
      };

      if (updated.name) {
        payload.slug = await this.generateUniqueSlug(
          updated.name,
          restaurantId
        );
      }

      await updateDoc(ref, payload);
    })();
  }

  /* =========================================================
     PRODUCTS
  ========================================================= */

  getProductsByRestaurant(restaurantId?: string): Observable<Product[]> {
    if (!restaurantId) return new Observable((sub) => sub.next([]));

    const ref = collection(
      this.firestore,
      `restaurants/${restaurantId}/products`
    );

    return collectionData(ref, { idField: 'productId' }) as Observable<
      Product[]
    >;
  }

  /* =========================================================
     ENABLE / DISABLE
  ========================================================= */

  disableRestaurant(restaurantId: string): Promise<void> {
    return updateDoc(doc(this.firestore, `restaurants/${restaurantId}`), {
      enabled: false,
      updatedAt: new Date(),
    });
  }

  enableRestaurant(restaurantId: string): Promise<void> {
    return updateDoc(doc(this.firestore, `restaurants/${restaurantId}`), {
      enabled: true,
      updatedAt: new Date(),
    });
  }
}
