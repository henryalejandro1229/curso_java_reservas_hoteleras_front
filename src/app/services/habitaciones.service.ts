import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { HabitacionRequest, HabitacionResponse } from '../models/Habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private readonly apiUrl: string = environment.apiUrl + '/habitaciones';

  constructor(private readonly http: HttpClient) { }

  getHabitaciones(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener las habitaciones', error);
        return throwError(() => error);
      })
    );
  }

  postHabitacion(habitacion: HabitacionRequest): Observable<HabitacionResponse> {
    return this.http.post<HabitacionResponse>(this.apiUrl, habitacion).pipe(
      catchError(error => {
        console.error('Error al registrar la habitación', error);
        return throwError(() => error);
      })
    );
  }

  putHabitacion(
    habitacion: HabitacionRequest,
    habitacionId: number
  ): Observable<HabitacionResponse> {
    return this.http.put<HabitacionResponse>(`${this.apiUrl}/${habitacionId}`, habitacion).pipe(
      catchError(error => {
        console.error('Error al actualizar la habitación', error);
        return throwError(() => error);
      })
    );
  }

  deleteHabitacion(habitacionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${habitacionId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar la habitación', error);
        return throwError(() => error);
      })
    );
  }

  actualizarEstado(habitacionId: number, idEstadoHabitacion: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${habitacionId}/estado/${idEstadoHabitacion}`,
      null
    ).pipe(
      catchError(error => {
        console.error('Error al actualizar el estado de la habitación', error);
        return throwError(() => error);
      })
    );
  }
}
