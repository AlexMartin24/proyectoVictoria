import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product, PRODUCT_CATEGORIES } from '../model/product.model';
import { ProductsService } from '../services/products.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  categories: { label: string; products$: Observable<Product[]> }[] = [];
  offerProducts$?: Observable<Product[]>; // <-- observable para la pestaña de ofertas

  constructor(private productsService: ProductsService) {}

ngOnInit(): void {
  const restaurantId = '4FLvsZsIUx7yxeciVjKb';

  // Tabs normales por categoría (solo productos disponibles)
  this.categories = PRODUCT_CATEGORIES.map((label) => ({
    label,
    products$: this.productsService.getAvailableProductsByCategory(
      restaurantId,
      label
    ),
  }));

  // Tab "Ofertas" (solo productos disponibles y que sean oferta)
  this.offerProducts$ = this.productsService
    .getAvailableProductsByCategory(restaurantId, 'offer')
    .pipe(
      map((products) =>
        products.filter((p) => p.isOffer && p.available)
      )
    );
}

  addNewProduct() {
    const restaurantId = '4FLvsZsIUx7yxeciVjKb';
    const newProduct: Product = {
      name: 'Hamburguesa doble',
      price: 12.99,
      category: 'Platos principales',
      description: 'Deliciosa hamburguesa con queso y bacon',
      imageUrl: 'https://miurl.com/hamburguesa.png',
      isOffer: false,
      available: true,
    };

    this.productsService.addProduct(restaurantId, newProduct)
      .then(() => console.log('Producto agregado!'))
      .catch(err => console.error('Error:', err));
  }

}
