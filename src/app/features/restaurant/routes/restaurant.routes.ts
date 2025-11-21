import { Routes } from '@angular/router';
import { RestaurantPageComponent } from '../restaurant-page/restaurant-page.component';
import { RestaurantProfileComponent } from '../restaurant-profile/restaurant-profile.component';

export const RESTAURANT_ROUTES: Routes = [
  { path: 'list', component: RestaurantPageComponent },
  { path: ':slug', component: RestaurantProfileComponent }
];
