import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { HuepedesComponent } from './components/huepedes/huepedes.component';
import { AuthGuard } from './guards/auth.guard';
import { ADMIN } from './constants/Roles';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'huespedes',
        component: HuepedesComponent,
        canActivate: [AuthGuard],
        data: { roles: [ADMIN] }
      },
      {
        path: 'habitaciones',
        component: HabitacionesComponent,
        canActivate: [AuthGuard],
        data: { roles: [ADMIN] }
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [AuthGuard],
        data: { roles: [ADMIN] }
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
