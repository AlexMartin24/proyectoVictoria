import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ProductListComponent } from '../product-list/product-list.component';
import { Product } from '../model/product.model';
import { Subscription } from 'rxjs';
import { ProductDialogService } from '../services/product-dialog.service';
import { ProductService } from '../services/product.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [SharedModule, ProductListComponent],
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  showDisabledTable = false;
  products: Product[] = [];
  private productsSub?: Subscription;
  private restaurantId = 'RESTAURANT_ID_AQUI';

  constructor(
    private productService: ProductService,
    private productDialogService: ProductDialogService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    this.productsSub?.unsubscribe();
  }

  /** Crear producto */
  onCreate() {
    console.log('ProductPageComponent: onCreate llamado');

    this.productDialogService
      .openProductDialog({ mode: 'create' })
      .subscribe(async (result) => {
        if (!result) return;

        try {
          await this.productService.createProduct({
            ...result,
            restaurantId: this.restaurantId,
          });

          this.dialogService.infoDialog(
            'Éxito',
            'Producto creado correctamente.'
          );
          this.loadProducts();
        } catch (error: any) {
          this.dialogService.errorDialog('Error', error.message);
        }
      });
  }

  /** Alternar vista habilitados/deshabilitados */
  toggleProductTableView() {
    this.showDisabledTable = !this.showDisabledTable;
  }

  /** Cargar productos */
  private loadProducts() {
    this.productsSub?.unsubscribe();
    this.productsSub = this.productService
      .getAllProductsFromRestaurant(this.restaurantId)
      .subscribe((data) => {
        this.products = data;
      });
  }

  /** Editar producto */
  onEdit(product: Product) {
    this.productDialogService
      .openProductDialog({ mode: 'edit', data: product })
      .subscribe(async (result) => {
        if (!result) return;

        try {
          await this.productService.updateProductData(
            this.restaurantId,
            product.productId!,
            result
          );

          this.dialogService.infoDialog(
            'Éxito',
            'Producto editado correctamente.'
          );
          this.loadProducts();
        } catch (error) {
          this.dialogService.errorDialog(
            'Error',
            'No se pudo editar el producto.'
          );
        }
      });
  }

  /** Deshabilitar producto */
  onRemove(product: Product) {
    if (!product.productId) return;

    this.dialogService
      .confirmDialog({
        title: 'Dar de baja producto',
        message: '¿Deseas deshabilitar este producto?',
        type: 'question',
      })
      .subscribe(async (result) => {
        if (!result) return;

        await this.productService.disableProduct(
          this.restaurantId,
          product.productId
        );

        this.loadProducts();
        this.dialogService.infoDialog('Éxito', 'Producto deshabilitado.');
      });
  }

  /** Habilitar producto */
  onEnable(product: Product) {
    if (!product.productId) return;

    this.dialogService
      .confirmDialog({
        title: 'Reactivar producto',
        message: '¿Deseas habilitar este producto?',
        type: 'question',
      })
      .subscribe(async (result) => {
        if (!result) return;

        await this.productService.enableProduct(
          this.restaurantId,
          product.productId
        );

        this.loadProducts();
        this.dialogService.infoDialog('Éxito', 'Producto habilitado.');
      });
  }
}
