import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { regexMail, regexPassword } from '../../../shared/pattern/patterns';
import { validatePassword } from '../../passwordValidator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register-dialog.component.html',
  styleUrl: './register-dialog.component.css',
})
export class RegisterDialogComponent {
  userForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RegisterDialogComponent>,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(regexMail),
        Validators.maxLength(30),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.required,
        validatePassword,
      ]),
    });
  }

  async registrarUsuario() {
    if (this.userForm.invalid) {
      console.log('Formulario no válido', this.userForm.errors);
      return;
    }

    try {
      await this.authService.registrarUsuario(this.userForm.value);
      // console.log(this.userForm.value);
      this.router.navigate(['/form']);
    } catch (error) {
      console.log(error);
    }
  }

  passwordHasError(errorCode: string): boolean {
    const control = this.userForm.get('password');
    return control?.hasError(errorCode) ?? false;
  }

  closeDialog() {
    this.dialogRef.close();
    // console.log("asd");
  }
}
