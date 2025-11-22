import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantService } from '../../../features/restaurant/services/restaurant.service';
import { Restaurant } from '../../../features/restaurant/model/restaurant.model';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { SearchBoxComponent } from '../../../shared/components/search-box/search-box.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [SharedModule, SearchBoxComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, OnDestroy {
  @Input() restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  private sub?: Subscription;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.restaurantService
      .getRestaurantsByStatus(true)
      .subscribe((data) => {
        this.restaurants = data;
        this.filteredRestaurants = data; // Inicialmente mostramos todos
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  openRestaurant(slug: string) {
    this.router.navigate(['/restaurant', slug]);
  }

  onSearch(term: string) {
    term = term.toLowerCase().trim();
    this.filteredRestaurants = this.restaurants.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.category?.toLowerCase().includes(term)
    );
  }
}
