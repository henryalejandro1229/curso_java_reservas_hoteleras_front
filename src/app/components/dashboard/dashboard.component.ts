import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN } from '../../constants/Roles';
import { AuthService } from '../../services/auth.service';

interface AccesoRapido {
  titulo: string;
  descripcion: string;
  icono: string;
  ruta: string;
  roles: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  readonly accesosDisponibles: AccesoRapido[];

  private readonly accesos: AccesoRapido[] = [
    {
      titulo: 'Huéspedes',
      descripcion: 'Administra la información de los huéspedes.',
      icono: 'groups',
      ruta: '/dashboard/huespedes',
      roles: [ADMIN]
    },
    {
      titulo: 'Habitaciones',
      descripcion: 'Consulta y administra las habitaciones.',
      icono: 'hotel',
      ruta: '/dashboard/habitaciones',
      roles: [ADMIN]
    },
    {
      titulo: 'Reservas',
      descripcion: 'Gestiona las reservas del hotel.',
      icono: 'calendar_month',
      ruta: '/dashboard/reservas',
      roles: [ADMIN]
    },
    {
      titulo: 'Usuarios',
      descripcion: 'Administra los usuarios del sistema.',
      icono: 'manage_accounts',
      ruta: '/dashboard/usuarios',
      roles: [ADMIN]
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.accesosDisponibles = this.accesos.filter(acceso =>
      this.authService.hasAnyRole(acceso.roles)
    );
  }

  get esDashboardPrincipal(): boolean {
    return this.router.url.split('?')[0] === '/dashboard';
  }

}
