import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SessionTimeoutDialogComponent } from '../dialog/session-timeout-dialog/session-timeout-dialog.component';

@Injectable({ providedIn: 'root' })
export class IdleService {
  private timeout!: any;
  private warningTimeout!: any;

  private readonly MAX_IDLE_TIME = 10 * 60 * 1000; // Tiempo de inactividad: 10 minutos
  private readonly WARNING_TIME = 30 * 1000; // 30 seg antes del logout

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    private ngZone: NgZone
  ) {
    this.initializeListeners();
    this.resetTimer();
  }

  initializeListeners() {
    const events = ['mousemove', 'click', 'keydown', 'wheel', 'touchstart'];

    events.forEach((event) =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }

  resetTimer() {
    this.ngZone.runOutsideAngular(() => {
      if (this.timeout) clearTimeout(this.timeout);
      if (this.warningTimeout) clearTimeout(this.warningTimeout);

      // Mostrar advertencia 30 segundos antes
      this.warningTimeout = setTimeout(() => {
        this.ngZone.run(() => this.showWarning());
      }, this.MAX_IDLE_TIME - this.WARNING_TIME);

      // Logout cuando se cumple el tiempo total
      this.timeout = setTimeout(() => {
        this.ngZone.run(() => this.auth.logout());
      }, this.MAX_IDLE_TIME);
    });
  }

  private showWarning() {
    const dialogRef = this.dialog.open(SessionTimeoutDialogComponent, {
      width: '350px',
      disableClose: true,
      data: { seconds: this.WARNING_TIME / 1000 },
    });

    let counter = this.WARNING_TIME / 1000;

    const interval = setInterval(() => {
      counter--;
      dialogRef.componentInstance.data.seconds = counter;

      // Forzar cierre cuando llega a 0
      if (counter <= 0) {
        clearInterval(interval);

        if (dialogRef) {
          dialogRef.close(false); // forza cierre
        }
      }
    }, 1000);
    dialogRef.afterClosed().subscribe((result) => {
      clearInterval(interval);

      if (result) {
        // Usuario quiere seguir conectado
        this.resetTimer();
      } else {
        this.auth.logout();
      }
    });
  }
}
