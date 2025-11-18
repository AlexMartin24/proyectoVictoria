import { Component, OnInit, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product, PRODUCT_CATEGORIES } from '../model/product.model';
import { ProductsService } from '../services/products.service';
import { MatSidenav } from '@angular/material/sidenav';
import { CartComponent } from '../../cart/cart/cart.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CartComponent, SharedModule],
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
    this.categories = PRODUCT_CATEGORIES.map((label) => ({
      label,
      products$: this.productsService.getAvailableProductsByCategory(
        restaurantId,
        label
      ),
    }));
    this.offerProducts$ = this.productsService.getOfferProducts(restaurantId);
  }

  addProductToCart(product: Product) {
    const item = this.cartItems.find((ci) => ci.product.name === product.name);
    if (item) {
      item.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
  }
}
