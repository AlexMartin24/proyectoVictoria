import { Routes } from '@angular/router';
// import { LoginComponent } from './auth/login/login.component';
import { FormComponent } from './auth/form/form.component';
import { IndexComponent } from './public/components/index/index.component';
import { ListUserComponent } from './features/Users/list-user/list-user.component';
import { ProductsComponent } from './features/products/products/products.component';
import { RestaurantProfileComponent } from './features/restaurant/restaurant-profile/restaurant-profile.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';

export const routes: Routes = [
  { path: 'form', component: FormComponent },

  // { path: '', component: IndexComponent },
  // { path: '', component: ListUserComponent },

  // { path: '', component: ProductsComponent },

  // { path: '', component: RestaurantComponent },
  // { path: 'restaurant-profile/:id', component: RestaurantProfileComponent },

  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart/cart.component').then(
        (c) => c.CartComponent
      ),
  },

  // { path: '', component: ResourcesComponent },


     { path: '', component: IndexComponent },


  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: 'restaurant',
    loadChildren: () =>
      import('./features/restaurant/routes/restaurant.routes').then(
        (m) => m.RESTAURANT_ROUTES
      ),
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./features/Users/user.routes').then((m) => m.USER_ROUTES),
  },
];
