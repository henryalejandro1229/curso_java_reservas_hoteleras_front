import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { HabitacionOption, ReservaRequest, ReservaResponse } from '../models/Reservas.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private apiUrl: string = environment.apiUrl + '/reservas';

  constructor(private http: HttpClient) { }

  getReservas(): Observable<ReservaResponse[]> {
    return this.http.get<ReservaResponse[]>(this.apiUrl).pipe(
      map(reservas =>
        [...reservas].sort((a, b) =>
          new Date(b.fechaReserva ?? b.fechaEntrada).getTime() - new Date(a.fechaReserva ?? a.fechaEntrada).getTime()
        )
      ),
      catchError(error => {
        console.error('Error al obtener las reservas', error);
        return of([]);
      })
    );
  }

  postReserva(reserva: ReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(this.apiUrl, reserva).pipe(
      catchError(error => {
        console.error('Error al registrar la reserva', error);
        return throwError(() => error);
      })
    );
  }

  putReserva(reserva: ReservaRequest, reservaId: string): Observable<ReservaResponse> {
    return this.http.put<ReservaResponse>(`${this.apiUrl}/${reservaId}`, reserva).pipe(
      catchError(error => {
        console.error('Error al actualizar la reserva', error);
        return throwError(() => error);
      })
    );
  }

  deleteReserva(reservaId: string): Observable<ReservaResponse> {
    return this.http.delete<ReservaResponse>(`${this.apiUrl}/${reservaId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar la reserva', error);
        return throwError(() => error);
      })
    );
  }

  getHabitaciones(): Observable<HabitacionOption[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/habitaciones`).pipe(
      map(habitaciones => habitaciones.map(habitacion => this.mapHabitacion(habitacion))),
      catchError(error => {
        console.error('Error al obtener las habitaciones', error);
        return of([]);
      })
    );
  }

  buscarHabitaciones(termino: string): Observable<HabitacionOption[]> {
    return this.getHabitaciones().pipe(
      map(habitaciones => {
        const busqueda = termino.trim().toLowerCase();
        if (!busqueda) {
          return habitaciones;
        }

        return habitaciones.filter(habitacion =>
          `${habitacion.nombre} ${habitacion.descripcion}`.toLowerCase().includes(busqueda)
        );
      })
    );
  }

  private mapHabitacion(habitacion: any): HabitacionOption {
    const id = Number(habitacion?.id ?? habitacion?.idHabitacion ?? 0);
    const numero = habitacion?.numero ?? habitacion?.numeroHabitacion ?? habitacion?.codigo ?? id;
    const tipo = habitacion?.tipo ?? habitacion?.nombre ?? 'Habitacion';
    const descripcionExtra = habitacion?.descripcion ?? habitacion?.estado ?? '';

    return {
      id,
      nombre: `Habitacion ${numero}`,
      descripcion: [tipo, descripcionExtra].filter(Boolean).join(' - ')
    };
  }
}
