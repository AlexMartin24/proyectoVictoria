import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from '../../../core/services/dialog.service';
import { SharedModule } from '../../../shared/shared.module';
import { Restaurant } from '../model/restaurant.model';
import { RestaurantService } from '../services/restaurant.service';
import { RestaurantDialogService } from '../services/restaurant-dialog.service';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css',
})
export class RestaurantComponent {
  restaurants$!: Restaurant[];
  displayedColumns: string[] = [
    'name',
    'address',
    'phone',
    'enabled',
    'openingHours',
    'actions',
  ];

  // DataSource de los restaurantes
  dataSource = new MatTableDataSource<Restaurant>();

  // Control para mostrar tabla de eliminados
  showDisabledTable: boolean = false;

  // @ViewChild(MatPaginator) permite acceder al componente MatPaginator en tu plantilla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private restaurantService: RestaurantService,
    private dialogService: DialogService,
    private restaurantDialogService: RestaurantDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRestaurantsByStatus(true);
  }

  getRestaurantsByStatus(enabled: boolean) {
    this.restaurantService.getRestaurantsByStatus(enabled).subscribe({
      next: (enabledRestaurants) => {
        this.dataSource.data = enabledRestaurants;
        console.log('Restaurantes habilitados:', enabledRestaurants);
      },
      error: (error) => {
        console.error('Error al obtener restaurantes habilitados:', error);
      },
    });
  }

  getDisabledRestaurants() {
    this.restaurantService.getRestaurantsByStatus(false).subscribe({
      next: (disabledRestaurants) => {
        this.dataSource.data = disabledRestaurants;
        console.log('Restaurantes deshabilitados:', disabledRestaurants);
      },
      error: (error) => {
        console.error('Error al obtener restaurantes deshabilitados:', error);
      },
    });
  }

  editRestaurant(restaurant: Restaurant) {
    if (!restaurant.restaurantId) {
      this.dialogService.errorDialog(
        'Error',
        'No se puede editar un restaurante sin ID.'
      );
      return;
    }

    this.restaurantDialogService
      .openRestaurantDialog({ mode: 'edit', data: restaurant })
      .subscribe(async (result) => {
        if (result) {
          try {
            await this.restaurantService.updateRestaurantData(
              restaurant.restaurantId,
              result
            );
            this.dialogService.infoDialog(
              'Éxito',
              'Datos editados correctamente.'
            );
          } catch (error) {
            this.dialogService.errorDialog(
              'Error',
              'No se pudo editar los datos del restaurante.'
            );
          }
        }
      });
  }

  deleteRestaurant(restaurant: Restaurant) {
    if (!restaurant.restaurantId) {
      console.error('ID del restaurant es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar Eliminación Permanente',
        message:
          '¿Estás seguro de que deseas eliminar este restaurante de forma permanente? Esta acción no se puede deshacer.',
        type: 'confirm',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.restaurantService.deleteRestaurant(
            restaurant.restaurantId
          );
          this.dialogService.infoDialog(
            'Éxito',
            'El restaurante ha sido eliminado correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

  async enableRestaurant(restaurant: Restaurant) {
    if (!restaurant.restaurantId) {
      console.error('ID del restaurant es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Reactivar restaurante',
        message: '¿Estás seguro de que deseas dar de alta este restaurante?',
        type: 'question',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.restaurantService.enableRestaurant(
            restaurant.restaurantId
          );

          // Recargar los restaurantes después de actualizar el estado
          this.getRestaurantsByStatus(true);

          this.dialogService.infoDialog(
            'Éxito',
            'El restaurante ha sido dado de alta correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

  async disableRestaurant(restaurant: Restaurant) {
    if (!restaurant.restaurantId) {
      console.error('ID del restaurant es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este restaurante?',
        type: 'confirm',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.restaurantService.disableRestaurant(
            restaurant.restaurantId
          );

          // Recargar los restaurantes después de actualizar el estado
          this.getRestaurantsByStatus(true);

          this.dialogService.infoDialog(
            'Éxito',
            'El restaurante ha sido deshabilitado correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

  showRestaurantTable() {
    if (this.showDisabledTable) {
      // Si la tabla de deshabilitados ya está activa, mostramos los restaurantes activos
      this.getRestaurantsByStatus(true); // Cargar restaurantes activos
    } else {
      // Sino está activa, muestra los restaurantes deshabilitados
      this.getDisabledRestaurants(); // Cargar restaurantes deshabilitados
    }
    // Cambiar el valor de showDisabledTable para alternar entre activos y deshabilitados
    this.showDisabledTable = !this.showDisabledTable;
  }

 addRestaurant() {
  this.restaurantDialogService
    .openRestaurantDialog({ mode: 'create' })
    .subscribe((result) => {
      if (result) {
        // Solo enviamos los datos del formulario y el campo 'enabled'.
        // No ponemos restaurantId ni createdAt; el servicio los genera.
        const newRestaurantData = {
          ...result,
          enabled: true,
        };

        this.restaurantService
          .addRestaurant(newRestaurantData)
          .then(() => {
            console.log('Datos enviados:', newRestaurantData);
            this.dialogService.infoDialog(
              'Éxito',
              'Restaurante creado correctamente.'
            );
            this.getRestaurantsByStatus(true);
          })
          .catch((error) => {
            console.log('Datos enviados:', newRestaurantData);
            this.dialogService.errorDialog('Error', error.message);
          });
      }
    });
}


  detail(restaurantId: number) {
    this.router.navigate(['/restaurant/', restaurantId]);
  }
}
