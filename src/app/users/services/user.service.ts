import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
  onSnapshot,
  DocumentReference,
  CollectionReference,
  QuerySnapshot,
  arrayUnion,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersRef: CollectionReference = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) {}

  // -------------------------------------------------------------------
  // 🔵 Helper base para escuchar queries (reduce código duplicado)
  // -------------------------------------------------------------------
  private listenUsers(q: any): Observable<User[]> {
    return new Observable<User[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
          const users = snapshot.docs.map((docSnap) => ({
            uid: docSnap.id,
            ...docSnap.data(),
          })) as User[];
          subscriber.next(users);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }
  // -------------------------------------------------------------------
  // 🟩 Crear usuario
  // -------------------------------------------------------------------

  async createUser(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);

    const now = new Date().toISOString();

    await setDoc(userRef, {
      ...user,
      restaurantsOwner: user.restaurantsOwner || [],
      restaurantsStaff: user.restaurantsStaff || [],
      enabled: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  // -------------------------------------------------------------------
  // 🟦 Actualizar usuario
  // -------------------------------------------------------------------

  async updateUser(uid: string, partialData: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, {
      ...partialData,
      updatedAt: new Date().toISOString(),
    });
  }
  // -------------------------------------------------------------------
  // 🟧 Roles y Staff
  // -------------------------------------------------------------------

  async addStaffToRestaurant(
    userUid: string,
    restaurantId: string
  ): Promise<void> {
    const userRef = doc(this.firestore, `users/${userUid}`);
    await updateDoc(userRef, {
      restaurantsStaff: arrayUnion(restaurantId),
      enabled: true,
      updatedAt: new Date().toISOString(),
    });
  }
  // -------------------------------------------------------------------
  // 🟥 Deshabilitar / Habilitar empleados
  // -------------------------------------------------------------------

  async disableStaffMember(userUid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${userUid}`);
    await updateDoc(userRef, {
      enabled: false,
      updatedAt: new Date().toISOString(),
    });
  }

  async enableStaffMember(userUid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${userUid}`);
    await updateDoc(userRef, {
      enabled: true,
      updatedAt: new Date().toISOString(),
    });
  }
  // -------------------------------------------------------------------
  // 🟦 Staff activo de un restaurante
  // -------------------------------------------------------------------

  getRestaurantStaff(restaurantId: string): Observable<User[]> {
    const q = query(
      this.usersRef,
      where('restaurantsStaff', 'array-contains', restaurantId),
      where('enabled', '==', true)
    );
    return this.listenUsers(q);
  }
  // -------------------------------------------------------------------
  // 🟫 Staff deshabilitado
  // -------------------------------------------------------------------

  getDisabledStaff(restaurantId: string): Observable<User[]> {
    const q = query(
      this.usersRef,
      where('restaurantsStaff', 'array-contains', restaurantId),
      where('enabled', '==', false)
    );
    return this.listenUsers(q);
  }
  // -------------------------------------------------------------------
  // 🟩 Obtener un usuario por UID
  // -------------------------------------------------------------------

  getUser(uid: string): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      const userRef: DocumentReference = doc(this.firestore, `users/${uid}`);

      const unsubscribe = onSnapshot(
        userRef,
        (snap) => {
          if (!snap.exists()) {
            subscriber.next(null);
            return;
          }
          subscriber.next({
            uid: snap.id,
            ...snap.data(),
          } as User);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }
}
