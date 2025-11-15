import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { regexMail } from '../../shared/pattern/patterns';
import { FirebaseError } from 'firebase/app';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { User, UserCredentials } from '../../features/Users/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private errorHandler: ErrorHandlerService
  ) {
    // Establecer persistencia a session
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        // Persistencia establecida
      })
      .catch((error) => {
        console.error('Error al establecer la persistencia:', error);
      });

    onAuthStateChanged(this.auth, async (user) => {
      this.isLoggedInSubject.next(!!user);
      if (user) {
        console.log('Usuario autenticado:', user);
        const docSnap = await getDoc(doc(this.firestore, `users/${user.uid}`));
        if (docSnap.exists()) {
          const usuarioFirestore = docSnap.data() as User;
          this.currentUserSubject.next(usuarioFirestore);
        } else {
          this.currentUserSubject.next(null);
        }
      } else {
        console.log('No hay usuario autenticado');
        this.currentUserSubject.next(null);
      }
    });
  }

  async login({ email, password }: UserCredentials) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(this.errorHandler.handleFirebaseError(error));
      } else {
        this.errorHandler.log(error);
        throw new Error('Error desconocido al iniciar sesión.');
      }
    }
  }

  async loginWithGoogle() {
    return await this.registerWithGoogle();
  }

  async registerWithGoogle() {
    const userCredential = await signInWithPopup(
      this.auth,
      new GoogleAuthProvider()
    );
    const user = userCredential.user;

    const userRef = doc(this.firestore, `users/${user.uid}`);

    // Verifica si el usuario ya existe
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      // Guardar datos básicos en Firestore
      await setDoc(userRef, {
        correo: user.email,
        nombre: user.displayName!.split(' ')[0], // Nombre
        apellido: user.displayName!.split(' ')[2] || '', // Apellido
        photoURL: user.photoURL || '', // URL de la foto de perfil
        enabled: true,
        createdAt: new Date().toISOString(),
      });
      return { uid: user.uid, newUser: true }; // Indicar que es un nuevo usuario
    } else {
      return { uid: user.uid, newUser: false }; // Indicar que ya existe
    }
  }

  async logout() {
    await signOut(this.auth);
    this.isLoggedInSubject.next(false);
  }

  async registrarUsuario(credenciales: UserCredentials) {
    // Validaciones
    if (!this.validateEmail(credenciales.email)) {
      throw new Error('Formato de correo inválido.');
    }
    if (!this.validatePassword(credenciales.password)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      credenciales.email,
      credenciales.password
    );

    const user = userCredential.user;
    const userRef = doc(this.firestore, `users/${user.uid}`);

    // guardar el email en Firestore
    await setDoc(userRef, {
      email: user.email,
      enabled: true,
      createdAt: new Date().toISOString(), // Guarda la fecha actual
    });
    return user.uid; // Devolver el ID del usuario para usarlo más tarde
  }

  async getUserData(userId: string): Promise<User | null> {
    const userRef = doc(this.firestore, `users/${userId}`);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return null;
    }
  }

  async addUserData(userId: string, userData: User) {
    const userRef = doc(this.firestore, `users/${userId}`);
    // merge: true para no sobrescribir el email si ya existe
    return setDoc(userRef, userData, { merge: true });
  }

  private validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  private validateEmail(email: string): boolean {
    const regex = new RegExp(regexMail);
    return regex.test(email);
  }

  getUserID(): string | null {
    const user = this.auth.currentUser;
    console.log(user);
    return user ? user.uid : null;
  }

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
}
