import { Injectable } from '@angular/core';
import { Role } from '../constants/Roles';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private readonly authService: AuthService) {}

  hasRole(role: Role | string): boolean {
    return this.authService.hasRole(role);
  }

  hasAnyRole(roles: Array<Role | string>): boolean {
    return roles.some(role => this.hasRole(role));
  }

  isAdmin(): boolean {
    return this.hasRole(Role.ADMIN);
  }
}