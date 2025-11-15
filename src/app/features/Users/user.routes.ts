import { Routes } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
// import { LoginComponent } from './login/login.component';


export const USER_ROUTES: Routes = [
  // { path: 'iniciar-sesion', component: LoginComponent },

  // { path: 'registrarse', component: RegistrarseComponent },
  

  { path: 'list', component: ListUserComponent },

  // {
  //   path: 'registrarse',
  //   component: RegistrarseComponent,
  //   children: [
  //     { path: 'form', component: FormComponent }
  //   ]
  // }
];
