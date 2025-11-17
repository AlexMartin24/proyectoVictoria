import { Component, OnInit, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product, PRODUCT_CATEGORIES } from '../model/product.model';
import { ProductsService } from '../services/products.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../../cart/cart/cart.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    CartComponent,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  categories: { label: string; products$: Observable<Product[]> }[] = [];
  offerProducts$!: Observable<Product[]>;

  @ViewChild('cartSidenav') cartSidenav!: MatSidenav;

  cartItems: Array<{ product: Product; quantity: number }> = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    const restaurantId = '4FLvsZsIUx7yxeciVjKb';

    // Tabs normales
    this.categories = PRODUCT_CATEGORIES.map((label) => ({
      label,
      products$: this.productsService.getAvailableProductsByCategory(
        restaurantId,
        label
      ),
    }));

    // Tab ofertas
    this.offerProducts$ = this.productsService.getOfferProducts(restaurantId);
  }

  addProductToCart(product: Product) {
    const item = this.cartItems.find(ci => ci.product.name === product.name);
    if (item) {
      item.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
  }

  increaseQuantity(item: { product: Product; quantity: number }) {
    item.quantity += 1;
  }

  decreaseQuantity(item: { product: Product; quantity: number }) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: { product: Product; quantity: number }) {
    this.cartItems = this.cartItems.filter(ci => ci !== item);
  }

  getTotal() {
    return this.cartItems.reduce((total, ci) => total + ci.product.price * ci.quantity, 0);
  }
}
    