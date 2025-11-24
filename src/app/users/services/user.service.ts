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
import { convertTimestamps } from '../../shared/helper/timestamp-converter';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersRef: CollectionReference = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) {}

  //-------------------------------------------------------------
  // 🟦 Helper general para escuchar cualquier query de usuarios
  private listenUsers(q: any): Observable<User[]> {
    return new Observable<User[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
          const users: User[] = snapshot.docs.map((docSnap) =>
            convertTimestamps<User>({
              uid: docSnap.id,
              ...docSnap.data(),
            })
          );
          subscriber.next(users);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  //-------------------------------------------------------------
  // 🟩 Crear / actualizar usuario
  //-------------------------------------------------------------
  async createUser(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async updateUser(uid: string, partialData: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, {
      ...partialData,
      updatedAt: new Date().toISOString(),
    });
  }

  //-------------------------------------------------------------
  // 🧑‍🍳 Staff (agregar/quitar empleados)
  //-------------------------------------------------------------
async addStaffToRestaurant(userUid: string, restaurantId: string): Promise<void> {
  const userRef = doc(this.firestore, `users/${userUid}`);

  await updateDoc(userRef, {
    restaurantsStaff: arrayUnion(restaurantId),
    enabled: true,
    updatedAt: new Date().toISOString(),
  });
}

  //-------------------------------------------------------------
  // 🟥 Deshabilitar / habilitar empleado
  //-------------------------------------------------------------
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

  //-------------------------------------------------------------
  // 🟦 Obtener staff activo de un restaurante
  //-------------------------------------------------------------
  getRestaurantStaff(restaurantId: string): Observable<User[]> {
    const q = query(
      this.usersRef,
      where('restaurantsStaff', 'array-contains', restaurantId),
      where('enabled', '==', true)
    );

    return this.listenUsers(q);
  }

  //------------------------------------------------------ -------
  // 🟫 Obtener staff deshabilitado (inactivo)
  //-------------------------------------------------------------
  getDisabledStaff(restaurantId: string): Observable<User[]> {
    const q = query(
      this.usersRef,
      where('restaurantsStaff', 'array-contains', restaurantId),
      where('enabled', '==', false)
    );

    return this.listenUsers(q);
  }

  //-------------------------------------------------------------
  // 🟩 Obtener un solo usuario
  //-------------------------------------------------------------
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
          const data = convertTimestamps<User>({
            uid: snap.id,
            ...snap.data(),
          });
          subscriber.next(data);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }
}
