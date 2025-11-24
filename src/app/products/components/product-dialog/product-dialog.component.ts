import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../model/product.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
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
  categories: string[] = ['Entradas', 'Platos Principales', 'Bebidas', 'Postres'];

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

    // FORMULARIO CON VALIDACIONES
    this.editForm = this.fb.group(
      {
        name: [p.name, Validators.required],
        category: [p.category, Validators.required],
        price: [p.price, [Validators.required, Validators.min(0)]],
        isOffer: [p.isOffer],
        offerPrice: [p.offerPrice],
        description: [p.description],
        available: [p.available],
        imageUrl: [p.imageUrl],
      },
      { validators: [this.offerValidator] } // VALIDACIÓN GENERAL
    );
  }

  /** 🔥 VALIDACIÓN PERSONALIZADA */
  offerValidator(form: AbstractControl): ValidationErrors | null {
    const isOffer = form.get('isOffer')?.value;
    const price = form.get('price')?.value;
    const offerPrice = form.get('offerPrice')?.value;

    if (!isOffer) return null;

    // Requerido si isOffer = true
    if (offerPrice == null || offerPrice === '') {
      return { offerRequired: true };
    }

    // debe ser menor
    if (offerPrice >= price) {
      return { invalidOffer: true };
    }

    return null;
  }

  saveProduct() {
    this.editForm.markAllAsTouched();

    if (this.editForm.invalid) {
      return;
    }

    const finalProduct: Product = {
      ...this.data.data,
      ...this.editForm.value,
    };

    this.dialogRef.close(finalProduct);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
