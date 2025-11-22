import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Restaurant } from '../model/restaurant.model';
import { SharedModule } from '../../../shared/shared.module';
import { BaseTableComponent } from '../../../shared/components/base-table/base-table.component';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [SharedModule, BaseTableComponent],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css'],
})
export class RestaurantListComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  @Input() restaurants: Restaurant[] = [];

  @Output() selectRestaurant = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Restaurant>();
  @Output() remove = new EventEmitter<Restaurant>();
  @Output() enable = new EventEmitter<Restaurant>();
  @Output() disable = new EventEmitter<Restaurant>();

  @ViewChild('tplEnabled', { static: true }) tplEnabled: any;
  @ViewChild('tplAddress', { static: true }) tplAddress: any;
  columns: any[] = [];

  /** Columnas a mostrar */
  ngAfterViewInit() {
    // Construimos las columnas después de que existan los templates
    this.columns = [
      { id: 'name', label: 'Nombre' },
      { id: 'address', label: 'Dirección', template: this.tplAddress }, // asignamos template luego
      { id: 'phone', label: 'Teléfono' },
      { id: 'enabled', label: 'Activo', template: this.tplEnabled }, // este tiene Sí/No
    ];

    // 👈 ESTA LÍNEA SOLUCIONA EL ERROR NG0100
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    // BaseTable refresca solo con Inputs
  }

  onSelect(id: string) {
    this.selectRestaurant.emit(id);
  }

  onEdit(r: Restaurant) {
    this.edit.emit(r);
  }

  onRemove(r: Restaurant) {
    this.remove.emit(r);
  }

  onEnable(r: Restaurant) {
    this.enable.emit(r);
  }

  onDisable(r: Restaurant) {
    this.disable.emit(r);
  }
}
