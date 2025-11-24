import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserDialogComponent } from '../components/user-dialog/user-dialog.component';
import { User } from '../model/user.model';

type DialogMode = 'create' | 'edit';

@Injectable({
  providedIn: 'root',
})
export class UserDialogService {
  constructor(private dialog: MatDialog) { }

  openUserDialog(options: { mode: DialogMode; data?: User }): Observable<any> {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      disableClose: true,
      data: {
        mode: options.mode,
        user: options.mode === 'edit' ? options.data : {
          name: '',
          lastname: '',
          email: '',
          birthdate: '',
          phone: '',
          address: '',
          schooldId: '',
          role: '',
        }
      },
    });

    return dialogRef.afterClosed();
  }
}
