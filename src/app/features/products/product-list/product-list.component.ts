import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../model/product.model';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() products: Product[] = [];

  @Output() selectProduct = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Product>();
  @Output() remove = new EventEmitter<Product>();
  @Output() enable = new EventEmitter<Product>();
  @Output() disable = new EventEmitter<Product>();

  displayedColumns: string[] = [
    'name',
    'price',
    'available',
    'category',
    'isOffer',
    'actions',
  ];

  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.data = this.products;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products']) {
      this.dataSource.data = this.products;
    }
  }

  /** Aplica filtro de búsqueda en la tabla */
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  onSelect(id: string) {
    this.selectProduct.emit(id);
  }

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
}
