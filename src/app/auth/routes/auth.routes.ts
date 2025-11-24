import { Routes } from '@angular/router';
import { FormComponent } from '../form/form.component';
// import { LoginComponent } from './login/login.component';

export const AUTH_ROUTES: Routes = [
  // { path: 'iniciar-sesion', component: LoginComponent },

  // { path: 'registrarse', component: RegistrarseComponent },
  

  { path: 'registrarse/form', component: FormComponent },

  // {
  //   path: 'registrarse',
  //   component: RegistrarseComponent,
  //   children: [
  //     { path: 'form', component: FormComponent }
  //   ]
  // }
];
