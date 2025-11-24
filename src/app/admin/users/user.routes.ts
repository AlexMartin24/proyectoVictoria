import { Routes } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';


export const USER_ROUTES: Routes = [
  

  { path: 'list', component: ListUserComponent },

  // {
  //   path: 'registrarse',
  //   component: RegistrarseComponent,
  //   children: [
  //     { path: 'form', component: FormComponent }
  //   ]
  // }
];
