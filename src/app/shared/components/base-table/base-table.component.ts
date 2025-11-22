import { Component, Input, AfterViewInit, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SharedModule } from '../../shared.module';

export interface BaseColumn {
  id: string;
  label: string;
  template?: any;
}

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.css']
})
export class BaseTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() columns: BaseColumn[] = [];
  @Input() data: any[] = [];
  @Input() filterPlaceholder?: string;
  @Input() actionsTemplate?: any;
  @Input() pageSize: number = 10;

  dataSource = new MatTableDataSource<any>([]);
  displayedIds: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.setupDisplayedColumns();
    this.dataSource.data = this.data || [];
  }

   ngOnChanges() {
    this.dataSource.data = this.data;

    this.displayedIds = this.columns.map(c => c.id);
    if (this.actionsTemplate) {
      if (!this.displayedIds.includes('actions')) {
        this.displayedIds.push('actions');
      }
    }
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setupDisplayedColumns() {
    this.displayedIds = this.columns.map(c => c.id);

    if (this.actionsTemplate) {
      this.displayedIds.push('actions');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
