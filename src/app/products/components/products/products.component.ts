import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Product, PRODUCT_CATEGORIES } from '../../model/product.model';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SharedModule } from '../../../shared/shared.module';
import { CartComponent } from '../../../customer/components/cart/cart.component';
import { Restaurant } from '../../../restaurant/model/restaurant.model';
import { RestaurantService } from '../../../restaurant/services/restaurant.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CartComponent, SharedModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild('cartSidenav') cartSidenav!: MatSidenav;

  private destroy$ = new Subject<void>();

  cartItems: Array<{ product: Product; quantity: number }> = [];
  selectedImage: string | null = null;

  categories: { label: string; products$: Observable<Product[]> }[] = [];
  offerProducts$!: Observable<Product[]>;

  restaurant: Restaurant | null = null;

  constructor(
    private productsService: ProductService,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.initializeProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Carga restaurante + categorías + ofertas */
  private initializeProducts() {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const slug = params.get('slug');
          if (!slug) {
            console.error('No slug provided');
            return [];
          }
          return this.restaurantService.getRestaurantBySlug(slug);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(restaurant => {
        if (!restaurant) return;

        this.restaurant = restaurant;
        const restaurantId = restaurant.restaurantId!;

        this.categories = PRODUCT_CATEGORIES.map(label => ({
          label,
          products$: this.productsService.getAvailableProductsByCategory(
            restaurantId,
            label
          ),
        }));

        this.offerProducts$ = this.productsService.getOfferProducts(restaurantId);
      });
  }

  /** ---- Carrito ---- */

  addProductToCart(product: Product) {
    const finalPrice = this.getFinalPrice(product);
    const item = this.cartItems.find(ci => ci.product.productId === product.productId);

    if (item) {
      item.quantity++;
      return;
    }

    // Guardamos el precio final actual para que no cambie si luego editás la oferta en Firestore
    this.cartItems.push({
      product: { ...product, price: finalPrice },
      quantity: 1,
    });
  }

  getCartQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  private getFinalPrice(product: Product): number {
    return product.isOffer && product.offerPrice != null
      ? product.offerPrice
      : product.price;
  }

  /** ---- Imagen Modal ---- */

  openImageModal(imageUrl?: string) {
    if (imageUrl) this.selectedImage = imageUrl;
  }

  closeImageModal() {
    this.selectedImage = null;
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/not-found.png';
  }
}
