import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../products/model/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  /** Obtener valor actual */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  /** Agregar o incrementar producto */
  addProduct(product: Product) {
    const items = this.getCartItems();
    const existing = items.find(ci => ci.product.productId === product.productId);
    const finalPrice = product.isOffer && product.offerPrice != null ? product.offerPrice : product.price;

    if (existing) {
      existing.quantity++;
    } else {
      items.push({ product: { ...product, price: finalPrice }, quantity: 1 });
    }

    this.cartItemsSubject.next([...items]);
  }

  /** Incrementar cantidad */
  increaseQuantity(item: CartItem) {
    item.quantity++;
    this.cartItemsSubject.next([...this.getCartItems()]);
  }

  /** Decrementar cantidad */
  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
      return;
    }
    this.cartItemsSubject.next([...this.getCartItems()]);
  }

  /** Eliminar item */
  removeItem(item: CartItem) {
    const items = this.getCartItems().filter(ci => ci !== item);
    this.cartItemsSubject.next([...items]);
  }

  /** Total de cantidad */
  getTotalQuantity(): number {
    return this.getCartItems().reduce((sum, ci) => sum + ci.quantity, 0);
  }

  /** Total precio */
  getTotalPrice(): number {
    return this.getCartItems().reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0);
  }
}
