// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../model/cart.model';
import { Product } from '../../products/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Lista interna de items del carrito
  private items: CartItem[] = [];

  // Observable para exponer los items
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  constructor() {}

  /** Agrega un producto al carrito */
  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.id === product.id);

    if (existingItem) {
      // Si ya existe, solo incrementamos la cantidad
      existingItem.quantity += quantity;
    } else {
      // Si no existe, agregamos un nuevo item
      this.items.push({ ...product, quantity });
    }

    // Emitimos el nuevo estado del carrito
    this.itemsSubject.next([...this.items]);
  }

  /** Elimina un item del carrito */
  removeFromCart(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this.itemsSubject.next([...this.items]);
  }

  /** Vacía todo el carrito */
  clearCart(): void {
    this.items = [];
    this.itemsSubject.next([...this.items]);
  }

  /** Obtiene el total del carrito */
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
