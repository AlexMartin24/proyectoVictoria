import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User, UserDialogData, UserDialogMode } from '../../model/user.model';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { CustomDateAdapter } from '../../../shared/fecha/CustomDateAdapter';
import {
  regexTextos,
  regexMail,
  regexDireccion,
  regexNumeros,
} from '../../../shared/pattern/patterns';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [SharedModule],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css'],
})
export class UserDialogComponent {
  editForm: FormGroup;
  modo!: UserDialogMode;

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData
  ) {
    this.modo = data.modo;
    const user = data.user;

    this.editForm = new FormGroup({
      name: new FormControl(user.name, [
        Validators.required,
        // Validators.pattern(regexTextos),
      ]),
      lastname: new FormControl(user.lastname, [
        Validators.required,
        // Validators.pattern(regexTextos),
      ]),
      // email: new FormControl(user.email, [
      //   Validators.required,
      //   Validators.pattern(regexMail),
      // ]),
email: new FormControl({ value: user.email, disabled: true }),
      birthdate: new FormControl(user.birthdate ?? ''),
      address: new FormControl(user.address ?? '', [
        Validators.pattern(regexDireccion),
      ]),
      phone: new FormControl(user.phone ?? '', [
        Validators.pattern(regexNumeros),
      ]),

      // Roles
      adminGlobal: new FormControl(user.roles.adminGlobal),
      adminLocal: new FormControl(user.roles.adminLocal),
      mozo: new FormControl(user.roles.mozo),
      cocina: new FormControl(user.roles.cocina),
      gerencia: new FormControl(user.roles.gerencia),
      customer: new FormControl(user.roles.customer),
      guest: new FormControl(user.roles.guest),
    });
  }

aceptar() {
  if (this.editForm.valid) {
    const formData = this.editForm.getRawValue(); // incluye campos deshabilitados si los necesitás
    const roles = {
      adminGlobal: formData.adminGlobal,
      adminLocal: formData.adminLocal,
      mozo: formData.mozo,
      cocina: formData.cocina,
      gerencia: formData.gerencia,
      customer: formData.customer,
      guest: formData.guest,
    };

    this.dialogRef.close({
      uid: this.data.user.uid,
      roles,
      name: formData.name,
      lastname: formData.lastname,
      birthdate: formData.birthdate,
      address: formData.address,
      phone: formData.phone
    });
  } else {
    this.editForm.markAllAsTouched();
  }
}
  cancelar() {
    this.dialogRef.close();
  }
}
