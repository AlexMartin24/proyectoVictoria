import { Component, Inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  regexAlfanumericoConEspacios,
  regexDescripcion,
  regexDireccion,
  regexNumeros,
  regexTelefono,
  regexTextos,
} from '../../../shared/pattern/patterns';
import {
  RestaurantDialogData,
  RestaurantDialogMode,
} from '../model/restaurant.model';

@Component({
  selector: 'app-restaurant-dialog',
  standalone: true,
  imports: [SharedModule, MatButtonToggleModule],
  templateUrl: './restaurant-dialog.component.html',
  styleUrls: ['./restaurant-dialog.component.css'],
})
export class RestaurantDialogComponent {
  editForm: FormGroup;
  mode!: RestaurantDialogMode;
  

constructor(
  private dialogRef: MatDialogRef<RestaurantDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: RestaurantDialogData
) {
  this.mode = data.mode;
  const restaurant = data.restaurant; // Aquí se recibe el restaurante



  // Verifica que restaurant tenga los datos esperados
  console.log('Restaurante recibido:', restaurant);

  this.editForm = new FormGroup({
    // Datos generales
    name: new FormControl(restaurant.name, [
      Validators.required,
      Validators.pattern(regexAlfanumericoConEspacios),
    ]),
    phone: new FormControl(restaurant.phone || '', [
      Validators.pattern(regexTelefono),
    ]),
    description: new FormControl(restaurant.description, [
      Validators.pattern(regexDescripcion),
    ]),
    address: new FormControl(restaurant.address, [
      Validators.required,
      Validators.pattern(regexDireccion),
    ]),
    addressNumber: new FormControl(restaurant.addressNumber, [
      Validators.required,
      Validators.pattern(regexNumeros),
    ]),
    openingHours: new FormControl(restaurant.openingHours || '', [
      Validators.pattern(regexTextos),
    ]),
    enabled: new FormControl(restaurant.enabled),
    imageLogo: new FormControl(restaurant.imageLogo),
    mainImage: new FormControl(restaurant.mainImage),
  });
}


  // Función para guardar el restaurante
saveRestaurant() {
  console.log('Valor del formulario:', this.editForm.value);  // Verifica el valor de 'enabled'
  if (this.editForm.valid) {
    let formData = this.editForm.value;
    this.dialogRef.close({ ...formData, restaurantId: this.data.restaurant.restaurantId });
  } else {
    this.editForm.markAllAsTouched();
  }
}
  // Función para cancelar la acción
  cancel() {
    this.dialogRef.close();
  }
}
