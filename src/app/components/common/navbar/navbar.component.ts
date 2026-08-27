import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ADMIN } from '../../../constants/Roles';
import Swal from 'sweetalert2';
import { showNotifySuccess } from '../../../shared/functions/Utilities';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  username: string | null = null;
  showMenuAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.authService.hasRole(ADMIN)) {
      this.showMenuAdmin = true;
    }
  }

  logout(): void {
    Swal.fire({
      title: 'Cerrar sesión',
      text: 'Estas seguro que deseas cerrar sesión?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      confirmButtonText: 'Si, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        showNotifySuccess('Sesión cerrada exitosamente');
      }
    });
  }
}
