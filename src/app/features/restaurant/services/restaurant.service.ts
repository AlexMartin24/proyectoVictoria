import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { FirebaseError } from 'firebase/app';
import { Restaurant } from '../model/restaurant.model';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  constructor(
    private firestore: Firestore,
    private errorHandler: ErrorHandlerService
  ) {}

  getRestaurantsByStatus(enabled: boolean): Observable<Restaurant[]> {
    const restaurantsRef = collection(this.firestore, 'restaurants');

    return new Observable<Restaurant[]>((subscriber) => {
      const restaurantsQuery = query(
        restaurantsRef,
        where('enabled', '==', enabled)
      );

      const unsubscribe = onSnapshot(
        restaurantsQuery,
        (restaurantSnapshots) => {
          const restaurants: Restaurant[] = restaurantSnapshots.docs.map(
            (doc) => {
              const jsonRestaurant = doc.data();
              // console.log('Restaurant data from Firestore:', jsonRestaurant); // Depura aquí

              // if (jsonRestaurant['dateAdmission'] instanceof Timestamp) {
              //   jsonRestaurant['dateAdmission'] =
              //     jsonRestaurant['dateAdmission'].toDate();
              // }

              return {
                restaurantId: doc.id,
                ...jsonRestaurant,
              } as unknown as Restaurant;
            }
          );

          subscriber.next(restaurants);
          console.log(restaurants);
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async disableRestaurant(restaurantId: string) {
    const restaurantRef = doc(this.firestore, `restaurants/${restaurantId}`);

    await updateDoc(restaurantRef, {
      enabled: false,
      updatedAt: new Date().toISOString(),
    });
  }

  async enableRestaurant(restaurantId: string) {
    const restaurantRef = doc(this.firestore, `restaurants/${restaurantId}`);

    await updateDoc(restaurantRef, {
      enabled: true,
      updatedAt: new Date().toISOString(),
    });
  }

  async updateRestaurantData(
    restaurantId: string,
    updatedData: Partial<Restaurant>
  ): Promise<void> {
    const restaurantRef = doc(this.firestore, `restaurants/${restaurantId}`);

    try {
      await updateDoc(restaurantRef, updatedData);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al actualizar el restaurante.');
      }
    }
  }

  async deleteRestaurant(restaurantId: string): Promise<void> {
    const restaurantRef = doc(this.firestore, `restaurants/${restaurantId}`);
    try {
      await deleteDoc(restaurantRef);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al eliminar el restaurante.');
      }
    }
  }

  async addRestaurant(newRestaurant: Restaurant): Promise<void> {
    try {
      const restaurantId = doc(collection(this.firestore, 'restaurants')).id;

      const restaurantRef = doc(this.firestore, `restaurants/${restaurantId}`);

      await setDoc(restaurantRef, {
        restaurantId,
        name: newRestaurant.name,
        address: newRestaurant.address,
        addressNumber: newRestaurant.addressNumber,
        description: newRestaurant.description || null,
        imageLogo: newRestaurant.imageLogo || null,
        mainImage: newRestaurant.mainImage || null,
        phone: newRestaurant.phone || null,
        rating: newRestaurant.rating ?? 0,
        enabled: newRestaurant.enabled,
        openingHours: newRestaurant.openingHours || null,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al crear el recurso.');
      }
    }
  }
}
