import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN, USER } from '../../constants/Roles';
import { RoleService } from '../../services/role.service';

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
      roles: [ADMIN, USER]
    },
    {
      titulo: 'Habitaciones',
      descripcion: 'Consulta y administra las habitaciones.',
      icono: 'hotel',
      ruta: '/dashboard/habitaciones',
      roles: [ADMIN, USER]
    },
    {
      titulo: 'Reservas',
      descripcion: 'Gestiona las reservas del hotel.',
      icono: 'calendar_month',
      ruta: '/dashboard/reservas',
      roles: [ADMIN, USER]
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
    private readonly roleService: RoleService,
    private readonly router: Router
  ) {
    this.accesosDisponibles = this.accesos.filter(acceso =>
      this.roleService.hasAnyRole(acceso.roles)
    );
  }

  get esDashboardPrincipal(): boolean {
    return this.router.url.split('?')[0] === '/dashboard';
  }

}
