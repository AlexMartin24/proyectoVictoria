export interface UserCredentials {
  email: string;
  password: string;
}

export interface User {
  uid: string;
  email: string;
  name?: string;
  lastname?: string;
  role: 'user' | 'admin' | 'guest';
  address?: string;
  birthdate?: string;
  phone?: string;
  photoURL?: string;
  enabled: boolean;
  createdAt: string;
}

export interface NewUser {
  email: string;
  name?: string;
  lastname?: string;
  role: 'user' | 'admin' | 'guest';
  address?: string;
  birthdate?: string;
  phone?: string;
  photoURL?: string;
  enabled: boolean;
  createdAt: string;
}

export type UserDialogMode = 'registro' | 'editar-perfil' | 'editar-usuario';

export interface UserDialogData {
  user: User;
  modo: UserDialogMode;
}
