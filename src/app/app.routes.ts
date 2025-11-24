import { Routes } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
import { FormComponent } from './auth/form/form.component';
import { IndexComponent } from './customer/components/index/index.component';

export const routes: Routes = [
  { path: 'form', component: FormComponent },


  
  {
    path: 'cart',
    loadComponent: () =>
      import('./customer/components/cart/cart.component').then(
        (c) => c.CartComponent
      ),
  },

  // { path: '', component: ResourcesComponent },


     { path: '', component: IndexComponent },


  {
    path: 'auth',
    loadChildren: () => import('./auth/routes/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'restaurant',
    loadChildren: () =>
      import('./restaurant/routes/restaurant.routes').then(
        (m) => m.RESTAURANT_ROUTES
      ),
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./users/routes/user.routes').then((m) => m.USER_ROUTES),
  },
];
