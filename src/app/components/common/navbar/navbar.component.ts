import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { showNotifySuccess } from '../../../shared/functions/Utilities';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  username: string | null = null;
  readonly showMenuAdmin: boolean;

  constructor(private authService: AuthService, private roleService: RoleService) {
    this.showMenuAdmin = this.roleService.isAdmin();
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
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
