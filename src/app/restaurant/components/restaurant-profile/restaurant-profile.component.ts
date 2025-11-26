import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { DialogService } from '../../../core/services/dialog.service';
import { ProductListComponent } from '../../../products/components/product-list/product-list.component';
import { Product } from '../../../products/model/product.model';
import { ProductDialogService } from '../../../products/services/product-dialog.service';
import { ProductService } from '../../../products/services/product.service';
import { Restaurant } from '../../model/restaurant.model';
import { RestaurantDialogService } from '../../services/restaurant-dialog.service';
import { RestaurantService } from '../../services/restaurant.service';
import { StaffManagementComponent } from '../../staff-management/staff-management.component';

@Component({
  selector: 'app-restaurant-profile',
  standalone: true,
  imports: [SharedModule, ProductListComponent, StaffManagementComponent],
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
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private dialogService: DialogService,
    private restaurantDialogService: RestaurantDialogService,
    private router: Router,
    private productService: ProductService,
    private productDialogService: ProductDialogService
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

  goToMenu() {
    this.router.navigate([this.restaurant.slug, 'menu'], {
      relativeTo: this.route.parent,
    });
  }

  createProduct() {
  this.productDialogService
    .openProductDialog({ mode: 'create' })
    .subscribe(async (result) => {
      if (!result) return;

      await this.productService.createProduct({
        ...result,
        restaurantId: this.restaurant.restaurantId!,
      });

      this.dialogService.infoDialog('Éxito', 'Producto creado correctamente.');
      this.loadProducts(this.restaurant.restaurantId!);
    });
}

  editProduct(product: Product) {
  this.productDialogService
    .openProductDialog({ mode: 'edit', data: product })
    .subscribe(async (result) => {
      if (!result) return;
      await this.productService.updateProduct(
        this.restaurant.restaurantId!,
        product.productId!,
        result
      );
      this.dialogService.infoDialog('Éxito', 'Producto editado correctamente.');
      this.loadProducts(this.restaurant.restaurantId!);
    });
}}
