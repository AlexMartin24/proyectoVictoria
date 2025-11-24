import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../model/cart.model';
import { Product } from '../../products/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {}

  /** Agrega o actualiza un producto */
  addToCart(product: Product, quantity: number = 1): void {
    const existing = this.items.find(i => i.id === product.id);

    if (existing) {
      existing.quantity += quantity;

      // Si la cantidad llega a 0, se quita directo
      if (existing.quantity <= 0) {
        this.removeFromCart(product.id!);
        return;
      }

    } else {
      this.items.push({ ...product, quantity });
    }

    this.itemsSubject.next([...this.items]);
  }

  /** Elimina un item */
  removeFromCart(productId: string): void {
    this.items = this.items.filter(i => i.id !== productId);
    this.itemsSubject.next([...this.items]);
  }

  /** Limpia carrito */
  clearCart(): void {
    this.items = [];
    this.itemsSubject.next([]);
  }

  /** Total */
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
