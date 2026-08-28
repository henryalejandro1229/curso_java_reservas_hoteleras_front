import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ModalUsuarioComponent } from './components/modals/modal-usuario/modal-usuario.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ModalReservasComponent } from './components/modals/modal-reservas/modal-reservas.component';
import { HuepedesComponent } from './components/huepedes/huepedes.component';
import { ModalHuespedesComponent } from './components/modals/modal-huespedes/modal-huespedes.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ModalHabitacionesComponent } from './components/modals/modal-habitaciones/modal-habitaciones.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    FooterComponent,
    NavbarComponent,
    UsuariosComponent,
    ModalUsuarioComponent,
    ReservasComponent,
    ModalReservasComponent,
    ModalUsuarioComponent,
    HuepedesComponent,
    ModalHuespedesComponent,
    HabitacionesComponent,
    ModalHabitacionesComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatChipsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
