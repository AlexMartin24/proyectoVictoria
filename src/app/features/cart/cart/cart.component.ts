import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { CartService } from '../services/cart.service';
import { CartItem } from '../model/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  items$ = this.cartService.items$;
  total$ = this.items$.pipe(
    map(items => items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  );

  constructor(private cartService: CartService) {}

  increase(item: CartItem) {
    this.cartService.addToCart(item, 1);
  }

  decrease(item: CartItem) {
    this.cartService.addToCart(item, -1);
    if (item.quantity <= 1) this.cartService.removeFromCart(item.id!);
  }

  remove(item: CartItem) {
    this.cartService.removeFromCart(item.id!);
  }

  clear() {
    this.cartService.clearCart();
  }
}
