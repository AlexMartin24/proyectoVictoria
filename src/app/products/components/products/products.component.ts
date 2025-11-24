import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
export class ProductsComponent implements OnInit {
  @ViewChild('cartSidenav') cartSidenav!: MatSidenav;

  cartItems: Array<{ product: Product; quantity: number }> = [];
  selectedImage: string | null = null;

  // Categorías normales
  categories: { label: string; products$: Observable<Product[]> }[] = [];
  // Pestaña de ofertas
  offerProducts$!: Observable<Product[]>;
  restaurant: Restaurant | null = null;
  restaurant$!: Observable<Restaurant>;

  constructor(
    private productsService: ProductService,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.initializeProducts();
  }

  initializeProducts() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('slug');
          if (!slug) throw new Error('No se recibió slug del restaurante');
          // Obtener restaurantId a partir del slug
          return this.restaurantService.getRestaurantBySlug(slug);
        })
      )
      .subscribe((restaurant) => {
        if (!restaurant) return;

        this.restaurant = restaurant; // <-- ya puedes usar name, description, etc.

        const restaurantId = restaurant.restaurantId!;
        // Inicializar categorías
        this.categories = PRODUCT_CATEGORIES.map((label) => ({
          label,
          products$: this.productsService.getAvailableProductsByCategory(
            restaurantId,
            label
          ),
        }));
        // Inicializar pestaña de ofertas
        this.offerProducts$ =
          this.productsService.getOfferProducts(restaurantId);
      });
  }

  addProductToCart(product: Product) {
    const finalPrice = this.getFinalPrice(product);

    const item = this.cartItems.find(
      (ci) => ci.product.productId === product.productId
    );

    if (item) {
      item.quantity += 1;
    } else {
      // Guardamos el precio final para que no cambie si luego editás la oferta
      this.cartItems.push({
        product: { ...product, price: finalPrice },
        quantity: 1,
      });
    }
  }

  getCartQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getFinalPrice(product: Product): number {
    return product.isOffer && product.offerPrice != null
      ? product.offerPrice
      : product.price;
  }

  openImageModal(imageUrl: string | undefined) {
    if (imageUrl) {
      this.selectedImage = imageUrl;
    }
  }

  closeImageModal() {
    this.selectedImage = null;
  }

  onImageError(event: any) {
    event.target.src = 'assets/img/not-found.png';
  }
}
