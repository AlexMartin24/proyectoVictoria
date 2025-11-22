import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Product } from '../model/product.model';
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
  // Lista de productos que recibe desde el componente padre
  @Input() products: Product[] = [];

  // Eventos que el componente emite hacia el padre
  @Output() edit = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();
  @Output() enable = new EventEmitter<Product>();
  @Output() disable = new EventEmitter<Product>();
  @Output() create = new EventEmitter<void>();

  // Referencias a templates definidos en el HTML (para columnas personalizadas)
  @ViewChild('tplAvailable', { static: true }) tplAvailable: any;
  @ViewChild('tplOffer', { static: true }) tplOffer: any;

  // Definición dinámica de columnas para la tabla
  columns: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  // Se ejecuta después de que las vistas hijas estén cargadas
  // Aquí se inicializan las columnas de la tabla usando los templates
  ngAfterViewInit() {
    this.columns = [
      { id: 'name', label: 'Nombre' },
      { id: 'price', label: 'Precio' },
      { id: 'available', label: 'Disponible', template: this.tplAvailable },
      { id: 'category', label: 'Categoría' },
      { id: 'isOffer', label: 'Oferta', template: this.tplOffer },
    ];

    // Se fuerza la detección de cambios porque las columnas se definen después de la vista
    this.cdr.detectChanges();
  }

  // Métodos que envían los eventos al componente padre
  onEdit(product: Product) {
    this.edit.emit(product);
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

  // ID del restaurante padre que se recibe por @Input
  @Input() restaurantId!: string;

  // Evento para notificar la creación de un producto nuevo
  @Output() productCreated = new EventEmitter<void>();

  onCreate() {
    this.productCreated.emit();
  }
}
