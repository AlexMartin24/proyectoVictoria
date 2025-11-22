import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../model/product.model';

export type ProductDialogMode = 'create' | 'edit';

export interface ProductDialogData {
  mode: ProductDialogMode;
  product?: Product;
}

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css'],
})
export class ProductDialogComponent {
  editForm: FormGroup;
  mode!: ProductDialogMode;

  constructor(
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) {
    this.mode = data.mode;

    const product = data.product || {
      productId: '',
      name: '',
      price: 0,
      available: true,
      description: '',
      imageUrl: '',
      category: '',
      isOffer: false,
    };

    this.editForm = new FormGroup({
      name: new FormControl(product.name, [Validators.required]),
      price: new FormControl(product.price, [
        Validators.required,
        Validators.min(0),
      ]),
      description: new FormControl(product.description),
      category: new FormControl(product.category),
      available: new FormControl(product.available),
      isOffer: new FormControl(product.isOffer),
      imageUrl: new FormControl(product.imageUrl),
    });
  }

saveProduct() {
  if (this.editForm.valid) {
    const formData = this.editForm.value;
    if (this.mode === 'edit') {
      formData.productId = this.data.product?.productId;
    }
    this.dialogRef.close(formData); // <-- NO incluye restaurantId
  } else {
    this.editForm.markAllAsTouched();
  }
}

  cancel() {
    this.dialogRef.close();
  }
}
