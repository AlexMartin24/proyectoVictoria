import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedModule } from '../../../shared/shared.module';
import { Restaurant } from '../model/restaurant.model';

@Component({
  selector: 'app-restaurant-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css'],
})
export class RestaurantListComponent
  implements OnInit, AfterViewInit, OnChanges
{
  // Recibe la lista de restaurantes desde el padre
  @Input() restaurants: Restaurant[] = [];

  // Emitters para las acciones
  @Output() selectRestaurant = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Restaurant>();
  @Output() remove = new EventEmitter<Restaurant>();
  @Output() enable = new EventEmitter<Restaurant>();
  @Output() disable = new EventEmitter<Restaurant>();

  displayedColumns: string[] = [
    'name',
    'address',
    'phone',
    'enabled',
    'actions',
  ];

  dataSource = new MatTableDataSource<Restaurant>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.data = this.restaurants;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['restaurants']) {
      this.dataSource.data = this.restaurants;
    }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  onSelect(id: string) {
    this.selectRestaurant.emit(id);
  }

  onEdit(restaurant: Restaurant) {
    this.edit.emit(restaurant);
  }

  onRemove(restaurant: Restaurant) {
    this.remove.emit(restaurant);
  }

  onEnable(restaurant: Restaurant) {
    this.enable.emit(restaurant);
  }

  onDisable(restaurant: Restaurant) {
    this.disable.emit(restaurant);
  }
}
