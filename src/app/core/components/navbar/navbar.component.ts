import { Component } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../../auth/components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isLoggedIn$!: Observable<boolean>;

  constructor(private dialog: MatDialog,
    private router: Router, private loginService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.loginService.isLoggedIn$;
  }

  logOut() {
    this.loginService
      .logout()
      .then(() => {
        this.router.navigate(['/']);

      })
      .catch((error) => console.log(error));
  }

  redirectToLogin() {
    this.router.navigate(['/auth/iniciar-sesion']);
  }



  loginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: { email: '', password: '' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo fue cerrado', result);
    });
  }

}

