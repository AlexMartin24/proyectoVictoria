import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../../shared/shared.module';
import { Product } from '../../../manager/products/model/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  @Input() cartItems: Array<{ product: Product; quantity: number }> = [];
  @Output() updateCart = new EventEmitter<
    Array<{ product: Product; quantity: number }>
  >();

  increaseQuantity(item: { product: Product; quantity: number }) {
    item.quantity += 1;
    this.emitCartUpdate();
  }

  decreaseQuantity(item: { product: Product; quantity: number }) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeItem(item);
    }
    this.emitCartUpdate();
  }

  removeItem(item: { product: Product; quantity: number }) {
    this.cartItems = this.cartItems.filter((ci) => ci !== item);
    this.emitCartUpdate();
  }

  getTotal() {
    return this.cartItems.reduce(
      (total, ci) => total + ci.product.price * ci.quantity,
      0
    );
  }

  private emitCartUpdate() {
    this.updateCart.emit(this.cartItems);
  }
}
