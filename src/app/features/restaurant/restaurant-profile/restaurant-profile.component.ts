import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../services/restaurant.service';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../products/model/product.model';
import { Subscription } from 'rxjs';
import { DialogService } from '../../../core/services/dialog.service';
import { RestaurantDialogService } from '../services/restaurant-dialog.service';

@Component({
  selector: 'app-restaurant-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './restaurant-profile.component.html',
  styleUrl: './restaurant-profile.component.css',
})
export class RestaurantProfileComponent implements OnInit, OnDestroy {
  restaurant!: Restaurant;
  dataSource = new MatTableDataSource<Product>();

  totalMenuItems = 0;
  totalComments = 0;
  monthlyViews = 0;

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private dialogService: DialogService,
    private restaurantDialogService: RestaurantDialogService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadRestaurant(slug);
      }
    });
  }

  loadRestaurant(slug: string) {
    this.subscription = this.restaurantService
      .getRestaurantBySlug(slug)
      .subscribe((rest) => {
        if (!rest) return;

        this.restaurant = rest;
        this.loadProducts(rest.restaurantId!);
      });
  }

  loadProducts(id: string) {
    this.restaurantService.getProductsByRestaurant(id).subscribe((products) => {
      this.dataSource.data = products;
      this.totalMenuItems = products.length;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  editRestaurant() {
    this.restaurantDialogService
      .openRestaurantDialog({ mode: 'edit', data: this.restaurant })
      .subscribe(async (result) => {
        if (result) {
          await this.restaurantService.updateRestaurantData(
            this.restaurant.restaurantId!,
            result
          );
          this.dialogService.infoDialog(
            'Éxito',
            'Perfil actualizado correctamente.'
          );
        }
      });
  }
}
