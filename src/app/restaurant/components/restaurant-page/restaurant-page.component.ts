import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from '../../model/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantDialogService } from '../../services/restaurant-dialog.service';
import { Subscription } from 'rxjs';
import { RestaurantListComponent } from '../restaurant-list/restaurant-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-restaurant-page',
  standalone: true,
  imports: [SharedModule, RestaurantListComponent],
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.css'],
})
export class RestaurantPageComponent implements OnInit, OnDestroy {
  showDisabledTable = false;
  private restaurantsSub?: Subscription;

  restaurants: Restaurant[] = [];

  constructor(
    private router: Router,
    private restaurantService: RestaurantService,
    private restaurantDialogService: RestaurantDialogService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadRestaurants();
  }

  ngOnDestroy() {
    this.restaurantsSub?.unsubscribe();
  }

  /** ---------------------------------------------------
   * Navegación con SLUG
   ---------------------------------------------------- */
  goToRestaurantDetail(slug: string) {
    this.router.navigate(['/restaurant', slug]);
  }

  /** ---------------------------------------------------
   * Crear restaurante (usa createRestaurant → slug automático)
   ---------------------------------------------------- */
  addRestaurant() {
    this.restaurantDialogService
      .openRestaurantDialog({ mode: 'create' })
      .subscribe(async (result) => {
        if (!result) return;

        try {
          const newRestaurant = await this.restaurantService.createRestaurant(
            result
          );
          this.dialogService.infoDialog(
            'Éxito',
            'Restaurante creado correctamente.'
          );
          this.loadRestaurants();
          // Opcional: navegar al perfil recién creado
          this.goToRestaurantDetail(newRestaurant.slug);
        } catch (error: any) {
          this.dialogService.errorDialog('Error', error.message);
        }
      });
  }

  /** ---------------------------------------------------
   * Alternar entre habilitados/deshabilitados
   ---------------------------------------------------- */
  showRestaurantTable() {
    this.showDisabledTable = !this.showDisabledTable;
    this.loadRestaurants();
  }

  /** ---------------------------------------------------
   * Cargar restaurantes según estado
   ---------------------------------------------------- */
  private loadRestaurants() {
    this.restaurantsSub?.unsubscribe();

    this.restaurantsSub = this.restaurantService
      .getRestaurantsByStatus(!this.showDisabledTable)
      .subscribe((data) => (this.restaurants = data));
  }

  /** ---------------------------------------------------
   * Editar restaurante
   ---------------------------------------------------- */
  onEdit(restaurant: Restaurant) {
    this.restaurantDialogService
      .openRestaurantDialog({ mode: 'edit', data: restaurant })
      .subscribe(async (result) => {
        if (result) {
          try {
            await this.restaurantService.updateRestaurantData(
              restaurant.restaurantId!,
              result
            );

            this.dialogService.infoDialog(
              'Éxito',
              'Datos editados correctamente.'
            );

            // recargar porque pudo cambiar el nombre → slug se vuelve a generar
            this.loadRestaurants();
          } catch (error) {
            this.dialogService.errorDialog(
              'Error',
              'No se pudo editar los datos.'
            );
          }
        }
      });
  }

  /** ---------------------------------------------------
   * Deshabilitar restaurante
   ---------------------------------------------------- */
  onRemove(restaurant: Restaurant) {
    if (!restaurant.restaurantId) return;

    this.dialogService
      .confirmDialog({
        title: 'Dar de baja restaurante',
        message: '¿Deseas deshabilitar este restaurante?',
        type: 'question',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.restaurantService.disableRestaurant(
            restaurant.restaurantId
          );
          this.loadRestaurants();
          this.dialogService.infoDialog('Éxito', 'Restaurante deshabilitado.');
        }
      });
  }

  /** ---------------------------------------------------
   * Habilitar restaurante
   ---------------------------------------------------- */
  onEnable(restaurant: Restaurant) {
    if (!restaurant.restaurantId) return;

    this.dialogService
      .confirmDialog({
        title: 'Reactivar restaurante',
        message: '¿Deseas habilitar este restaurante?',
        type: 'question',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.restaurantService.enableRestaurant(
            restaurant.restaurantId
          );
          this.loadRestaurants();
          this.dialogService.infoDialog('Éxito', 'Restaurante habilitado.');
        }
      });
  }

  /** (Extra) por compatibilidad con botones viejos */
  onDisable(restaurant: Restaurant) {
    this.restaurantService.disableRestaurant(restaurant.restaurantId!);
    this.loadRestaurants();
  }
}
