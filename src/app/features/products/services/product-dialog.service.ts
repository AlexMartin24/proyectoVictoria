import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../model/product.model';
import { Observable } from 'rxjs';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

type DialogMode = 'create' | 'edit';


@Injectable({
  providedIn: 'root'
})
export class ProductDialogService {

  constructor(private dialog: MatDialog) {}

  openProductDialog(options: {
    mode: DialogMode;
    data?: Product;
  }): Observable<Product> {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      disableClose: true,
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      hasBackdrop: true,
      data: {
        mode: options.mode,
        restaurant:
          options.mode === 'edit'
            ? options.data
            : {

                productId: '',
                name: '',
                description: '',
                price: 0,
                available: false,
                isOffer: false,
                category: '',
                enabled: false,
                createdAt: new Date(),
                updatedAt: new Date().toISOString(),
              },
      },
    });

    return dialogRef.afterClosed();
  }
}
