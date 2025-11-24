import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

// import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

import { User, NewUser } from '../model/user.model';
import { UserService } from '../services/user.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { DialogService } from '../../../core/services/dialog.service';
import { UserDialogService } from '../services/user-dialog.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css',
})
export class ListUserComponent {
  users$!: User[];
  displayedColumns: string[] = [
    'Name',
    'Contact',
    'AdditionalInformation',
    'Address',
    // 'Detalle',
    'Actions',
  ];

  // DataSource de los users
  dataSource = new MatTableDataSource<User>();

  // Control para mostrar tabla de eliminados
  showDisabledTable: boolean = false;

  // @ViewChild(MatPaginator) permite acceder al componente MatPaginator en tu plantilla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private dialog: MatDialog,
    private usersService: UserService,
    private dialogService: DialogService,
    private userDialogService: UserDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEnabledUsers();
  }

  getEnabledUsers() {
    this.usersService.getUsersByStatus(true).subscribe({
      next: (enabledUsers) => {
        this.dataSource.data = enabledUsers;
        console.log('Usuarios habilitados:', enabledUsers);
      },
      error: (error) => {
        console.error('Error al obtener usuarios habilitados:', error);
      },
    });
  }

  getDisabledUsers() {
    this.usersService.getUsersByStatus(false).subscribe({
      next: (disabledUsers) => {
        this.dataSource.data = disabledUsers;
        console.log('Usuarios deshabilitados:', disabledUsers);
      },
      error: (error) => {
        console.error('Error al obtener usuarios deshabilitados:', error);
      },
    });
  }

addUser() {
  this.userDialogService.openUserDialog({ mode: 'create' }).subscribe((result) => {
    if (result) {
      // Asignar valores por defecto
      const newUser: NewUser = {
        name: result.name || '',
        lastname: result.lastname || '',
        email: result.email || '',
        birthdate: result.birthdate || new Date(),
        address: result.address || '',
        phone: result.phone || '',
        role: result.role || '',
        enabled: false,
        createdAt: new Date().toISOString(),
      };

      // Generar contraseña temporal para el usuario
      const tempPassword = Math.random().toString(36).slice(-8);

      this.usersService.createUserAsAdmin(newUser, tempPassword)
        .then(() => {
          this.dialogService.infoDialog(
            'Éxito', 
            'El usuario ha sido agregado correctamente y recibirá un correo para activar su cuenta.'
          );
        })
        .catch((error) => {
          this.dialogService.errorDialog('Error', error.message);
        });
    }
  });
}

  editUser(user: User) {
    if (!user.uid) {
      this.dialogService.errorDialog(
        'Error',
        'No se puede editar un usuario sin ID.'
      );
      return;
    }

    this.userDialogService
      .openUserDialog({ mode: 'edit', data: user })
      .subscribe(async (result) => {
        if (result) {
          try {
            await this.usersService.updateUserData(user.uid, result);
            this.dialogService.infoDialog(
              'Éxito',
              'Datos editados correctamente.'
            );
          } catch (error) {
            this.dialogService.errorDialog(
              'Error',
              'No se pudo editar los datos del usuario.'
            );
          }
        }
      });
  }

  disableUser(user: User) {
    if (!user.uid) {
      console.error('ID del user es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este usuario?',
        type: 'confirm',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.usersService.disableUser(user.uid);
          this.dialogService.infoDialog(
            'Éxito',
            'El usuario ha sido eliminado correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

  enableUser(user: User) {
    if (!user.uid) {
      console.error('ID del user es indefinido');
      return;
    }
    this.dialogService
      .confirmDialog({
        title: 'Confirmar alta del usuario',
        message: '¿Estás seguro de que deseas dar de alta este usuario?',
        type: 'enable',
      })
      .subscribe(async (result) => {
        if (result) {
          await this.usersService.enableUser(user.uid);
          this.dialogService.infoDialog(
            'Éxito',
            'El usuario ha sido dado de alta correctamente.'
          );
        } else {
          this.dialogService.infoDialog(
            'Cancelado',
            'No se realizó la acción.'
          );
        }
      });
  }

  // Función para mostrar usuarios activos o deshabilitados
  showUsersTable() {
    if (this.showDisabledTable) {
      // Si la tabla de deshabilitados ya está activa, mostramos los usuarios activos
      this.getEnabledUsers(); // Cargar usuarios activos
    } else {
      // Sino está activa, muestra los usuarios deshabilitados
      this.getDisabledUsers(); // Cargar usuarios deshabilitados
    }
    // Cambiar el valor de showDisabledTable para alternar entre activos y deshabilitados
    this.showDisabledTable = !this.showDisabledTable;
  }
}
