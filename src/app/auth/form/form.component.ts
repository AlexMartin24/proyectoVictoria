import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { regexNumeros, regexTextos } from '../../shared/pattern/patterns';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  firstUserForm: FormGroup;
  secondUserForm: FormGroup;
  isLinear = true;

  constructor(private authService: AuthService, private router: Router) {
    this.firstUserForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(regexTextos),
        Validators.maxLength(30),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.pattern(regexTextos),
        Validators.maxLength(30),
      ]),
      role: new FormControl('', [
        Validators.required,
        Validators.pattern(regexTextos),
        Validators.maxLength(13),
      ]),
    });

    this.secondUserForm = new FormGroup({
      address: new FormControl('', [Validators.maxLength(50)]),
      birthdate: new FormControl(''),
      phone: new FormControl('', [
        Validators.pattern(regexNumeros),
        Validators.maxLength(15),
      ]),
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const uid = this.authService.getUserID();
    if (uid) {
      try {
        const userData = await this.authService.getUserData(uid);
        if (userData) {
          this.firstUserForm.patchValue({
            name: userData.name,
            lastname: userData.lastname,
            roles: userData.roles,
          });

          this.secondUserForm.patchValue({
            address: userData.address,
            birthdate: userData.birthdate,
            phone: userData.phone,
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    }
  }

  submitForm() {
    if (this.firstUserForm.invalid || this.secondUserForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const nuevoUsuario = {
      ...this.firstUserForm.value,
      ...this.secondUserForm.value,
    };

    const uid = this.authService.getUserID();
    if (!uid) {
      console.error('No hay usuario autenticado. Iniciar sesión');
      this.router.navigate(['/auth/iniciar-sesion/']);
      return;
    }

    this.authService
      .saveUser(uid, nuevoUsuario)
      .then(() => {
        console.log('Datos guardados correctamente');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error('Error guardando datos: ', error, nuevoUsuario);
      });
  }
}
