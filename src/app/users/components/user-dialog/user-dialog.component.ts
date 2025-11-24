import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User, UserDialogData, UserDialogMode } from '../../model/user.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { SharedModule } from '../../../shared/shared.module';
import { CustomDateAdapter } from '../../../shared/fecha/CustomDateAdapter';
import { regexTextos, regexMail, regexDireccion, regexNumeros } from '../../../shared/pattern/patterns';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [SharedModule],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
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
  name: new FormControl(user.name, [Validators.required, Validators.pattern(regexTextos)]),
  lastname: new FormControl(user.lastname, [Validators.required, Validators.pattern(regexTextos)]),
  email: new FormControl(user.email, [Validators.required, Validators.pattern(regexMail)]),
  birthdate: new FormControl(user.birthdate, [Validators.required]),
  role: new FormControl(user.role, [Validators.required, Validators.pattern(regexTextos)]),
  address: new FormControl(user.address ?? '', [Validators.pattern(regexDireccion)]),
  phone: new FormControl(user.phone ?? '', [Validators.pattern(regexNumeros)]),
});


  }

aceptar() {
  if (this.editForm.valid) {
    const formData = this.editForm.value;

    this.dialogRef.close({
      ...formData,
      uid: this.data.user.uid,
    });
  } else {
    this.editForm.markAllAsTouched();
  }
}

  cancelar() {
    this.dialogRef.close();
  }
}
