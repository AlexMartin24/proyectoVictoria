import { Routes } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
import { FormComponent } from './auth/form/form.component';
import { IndexComponent } from './core/components/index/index.component';
import { ListUserComponent } from './features/Users/list-user/list-user.component';
import { ResourcesComponent } from './features/Resources/resources/resources.component';
import { ListSchoolsComponent } from './features/Schools/list-schools/list-schools.component';

export const routes: Routes = [

  { path: 'form', component: FormComponent },

  // { path: '', component: IndexComponent },
  { path: '', component: ListUserComponent },

  // { path: '', component: ResourcesComponent },

  // { path: '', component: ListSchoolsComponent },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

    {
    path: 'users',
    loadChildren: () => import('./features/Users/user.routes').then((m) => m.USER_ROUTES),
  },

];
