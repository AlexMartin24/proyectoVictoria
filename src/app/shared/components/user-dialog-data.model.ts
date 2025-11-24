import { User } from "../../admin/users/model/user.model";

export type UserDialogMode = 'registro' | 'editar-perfil' | 'editar-usuario';

export interface UserDialogData {
  user: User;
  modo: UserDialogMode;
}
