import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../model/product.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

export type ProductDialogMode = 'create' | 'edit';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css'],
})
export class ProductDialogComponent {
  mode: ProductDialogMode;
  editForm: FormGroup;
  categories: string[] = ['Entradas', 'Platos Principales', 'Bebidas', 'Postres']; // <-- tu lista de categorías

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: ProductDialogMode; data?: Product },
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private fb: FormBuilder
  ) {

    this.mode = data.mode;

    const p = data.data || {
      productId: '',
      name: '',
      price: 0,
      available: true,
      description: '',
      imageUrl: '',
      category: '',
      isOffer: false,
      offerPrice: null,
      restaurantId: '',
    };

    this.editForm = this.fb.group({
      name: [p.name, Validators.required],
      category: [p.category, Validators.required],
      price: [p.price, [Validators.required, Validators.min(0)]],
      isOffer: [p.isOffer],
      offerPrice: [p.offerPrice],
      description: [p.description],
      available: [p.available],
      imageUrl: [p.imageUrl],
    });
  }

  saveProduct() {
    const finalProduct: Product = {
      ...this.data.data, // mantiene id y restaurantId
      ...this.editForm.value, // datos editados
    };

    this.dialogRef.close(finalProduct);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
