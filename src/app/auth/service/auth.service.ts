import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
} from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { regexMail } from '../../shared/pattern/patterns';
import { FirebaseError } from 'firebase/app';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { User, UserCredentials } from '../../features/Users/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private errorHandler: ErrorHandlerService
  ) {
    /** Persistencia */
    setPersistence(this.auth, browserLocalPersistence).catch((error) =>
      console.error('Error al establecer persistencia:', error)
    );

    /** Listener de login */
    onAuthStateChanged(this.auth, async (user) => {
      const logged = !!user;
      this.isLoggedInSubject.next(logged);

      if (!user) {
        this.currentUserSubject.next(null);
        return;
      }

      const userData = await this.getUserData(user.uid);
      this.currentUserSubject.next(userData);
    });
  }

  // ----------------------------------------------------------------------
  // LOGIN EMAIL/PASSWORD
  // ----------------------------------------------------------------------
  async login({ email, password }: UserCredentials) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.handleError(error);
    }
  }

  // ----------------------------------------------------------------------
  // LOGIN GOOGLE
  // ----------------------------------------------------------------------
  async loginWithGoogle() {
    try {
      const credentials = await signInWithPopup(
        this.auth,
        new GoogleAuthProvider()
      );
      const user = credentials.user;

      // Extraer nombre y apellido
      const displayName = user.displayName ?? '';
      const [name = '', lastname = ''] = displayName.split(' ');

      // Guardar / actualizar datos del usuario
      await this.saveUser(user.uid, {
        uid: user.uid,
        email: user.email ?? '',
        name,
        lastname,
        photoURL: user.photoURL ?? '',
        role: 'usuario', // DEFAULT
        enabled: true,
        createdAt: new Date().toISOString(),
      });

      return { uid: user.uid };
    } catch (error) {
      this.handleError(error);
    }
  }

  // ----------------------------------------------------------------------
  // REGISTER EMAIL/PASSWORD
  // ----------------------------------------------------------------------
  async registrarUsuario({ email, password }: UserCredentials) {
    if (!this.validateEmail(email)) {
      throw new Error('Formato de correo inválido.');
    }
    if (!this.validatePassword(password)) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const user = cred.user;

      await this.saveUser(user.uid, {
        uid: user.uid,
        email: user.email ?? '',
        role: 'usuario',
        enabled: true,
        createdAt: new Date().toISOString(),
      });

      return user.uid;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ----------------------------------------------------------------------
  // GET CURRENT USER
  // ----------------------------------------------------------------------
  async getUserData(userId: string): Promise<User | null> {
    const userRef = doc(this.firestore, `users/${userId}`);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as User) : null;
  }

  // ----------------------------------------------------------------------
  // SAVE USER DATA (UNIFICADO)
  // ----------------------------------------------------------------------
  async saveUser(uid: string, data: Partial<User>) {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, { uid, ...data }, { merge: true });
  }

  // ----------------------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------------------
  async logout() {
    await signOut(this.auth);
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  // ----------------------------------------------------------------------
  // UTILS
  // ----------------------------------------------------------------------
  private validateEmail(email: string): boolean {
    const regex = new RegExp(regexMail);
    return regex.test(email);
  }

  private validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  private handleError(error: any): never {
    if (error instanceof FirebaseError) {
      throw new Error(this.errorHandler.handleFirebaseError(error));
    }
    console.error('Error desconocido:', error);
    throw new Error('Error desconocido durante la autenticación.');
  }

  getUserID(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }
}
