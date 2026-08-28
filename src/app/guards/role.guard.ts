import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from '../services/role.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private readonly roleService: RoleService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const roles = route.data['roles'] as string[] | undefined;
    if (!roles || this.roleService.hasAnyRole(roles)) {
      return true;
    }

    void Swal.fire('Acceso denegado', 'No tienes permisos para acceder a este recurso.', 'warning');
    void this.router.navigate(['/dashboard']);
    return false;
  }
}