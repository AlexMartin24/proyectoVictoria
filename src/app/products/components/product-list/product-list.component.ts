import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Product } from '../../model/product.model';
import { SharedModule } from '../../../shared/shared.module';
import { BaseTableComponent } from '../../../shared/components/base-table/base-table.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [SharedModule, BaseTableComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements AfterViewInit {
  @Input() products: Product[] = [];

  // Eventos correctos
  @Output() edit = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();
  @Output() enable = new EventEmitter<Product>();
  @Output() disable = new EventEmitter<Product>();
  @Output() create = new EventEmitter<void>();

  @ViewChild('tplAvailable', { static: true }) tplAvailable: any;
  @ViewChild('tplOffer', { static: true }) tplOffer: any;

  columns: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.columns = [
      { id: 'name', label: 'Nombre' },
      { id: 'price', label: 'Precio' },
      { id: 'available', label: 'Disponible', template: this.tplAvailable },
      { id: 'category', label: 'Categoría' },
      { id: 'isOffer', label: 'Oferta', template: this.tplOffer },
    ];

    this.cdr.detectChanges();
  }

  /** EMITIR EVENTOS AL PADRE */
  onEdit(product: Product) {
    console.log('Editing product:', product);
    this.edit.emit(product);   // <-- función correcta
  }

  onRemove(product: Product) {
    this.remove.emit(product);
  }

  onEnable(product: Product) {
    this.enable.emit(product);
  }

  onDisable(product: Product) {
    this.disable.emit(product);
  }

  @Input() restaurantId!: string;

  onCreate() {
    console.log('Create clicked');
    this.create.emit();     // <-- correcto
  }
}
