import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { showNotifySuccess } from '../../shared/functions/Utilities';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: async () => {
        this.router.navigate(['/dashboard']);
        await showNotifySuccess('Inicio de sesión exitoso');
      },
      error: () => { this.error = 'Credenciales inválidas'; }
    });
  }

}
