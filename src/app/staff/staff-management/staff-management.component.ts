import {
  Component,
  OnInit,
  inject,
  TemplateRef,
  ViewChild,
  Input,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { User } from '../../users/model/user.model'; // ✔️ CORRECTO
import { AuthService } from '../../auth/services/auth.service';
import { DialogService } from '../../core/services/dialog.service';
import {
  BaseColumn,
  BaseTableComponent,
} from '../../shared/components/base-table/base-table.component';
import { UserService } from '../../users/services/user.service';
import { UserDialogComponent } from '../../users/components/user-dialog/user-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [SharedModule, BaseTableComponent],
  templateUrl: './staff-management.component.html',
  styleUrl: './staff-management.component.css',
})
export class StaffManagementComponent implements OnInit {
  private userService = inject(UserService);
  private dialogService = inject(DialogService);
  private dialog: MatDialog = inject(MatDialog);

  @Input() restaurantId!: string;
  @Input() showDisabled: boolean = false;

  staff: User[] = [];

  columns: BaseColumn[] = [
    { id: 'fullname', label: 'Nombre' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Rol' },
  ];

  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.loadStaff();
  }

  ngOnChanges() {
    this.loadStaff();
  }

  loadStaff() {
    if (!this.restaurantId) return;

    const observable = this.showDisabled
      ? this.userService.getDisabledStaff(this.restaurantId)
      : this.userService.getRestaurantStaff(this.restaurantId);

    observable.subscribe((users) => {
      this.staff = users.map((u) => ({
        ...u,
        fullname: `${u.lastname} ${u.name}`,
        role: this.getUserRole(u),
      }));
    });
  }
  private getUserRole(user: User): string {
    if (!user.roles) return 'Sin rol';
    return (
      Object.keys(user.roles).find(
        (r) => user.roles[r as keyof typeof user.roles] === true
      ) ?? 'Sin rol'
    );
  }

  toggleDisabled() {
    this.showDisabled = !this.showDisabled;
    this.loadStaff();
  }

  disable(user: User) {
    this.dialogService
      .confirmDialog({
        title: 'Deshabilitar empleado',
        message: '¿Deseas deshabilitar este empleado?',
        type: 'confirm',
      })
      .subscribe(async (ok) => {
        if (ok && user.uid) {
          await this.userService.disableStaffMember(user.uid);
          this.dialogService.infoDialog('OK', 'Empleado deshabilitado.');
        }
      });
  }

  enable(user: User) {
    this.dialogService
      .confirmDialog({
        title: 'Habilitar empleado',
        message: '¿Deseas volver a habilitar este empleado?',
        type: 'enable',
      })
      .subscribe(async (ok) => {
        if (ok && user.uid) {
          await this.userService.enableStaffMember(user.uid);
          this.dialogService.infoDialog('OK', 'Empleado habilitado.');
        }
      });
  }

  async changeRole(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user, modo: 'editar-usuario' },
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (!result || !user.uid) return;

    await this.userService.updateUser(user.uid, { roles: result.roles });
    this.dialogService.infoDialog('OK', 'Roles actualizados correctamente.');
    this.loadStaff(); // recargar tabla
  }
}
