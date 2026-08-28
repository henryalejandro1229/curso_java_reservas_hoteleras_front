import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { HuespedRequest, HuespedResponse } from '../models/Huesped.model';

@Injectable({
  providedIn: 'root'
})
export class HuepedesService {

  private apiUrl: string = environment.apiUrl + '/huespedes';

  constructor(private http: HttpClient) { }

  getHuespedes(): Observable<HuespedResponse[]> {
    return this.http.get<HuespedResponse[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener los huéspedes', error);
        return of([]);
      })
    );
  }

  postHuesped(huesped: HuespedRequest): Observable<HuespedResponse> {
    return this.http.post<HuespedResponse>(this.apiUrl, huesped).pipe(
      catchError(error => {
        console.error('Error al registrar el huésped', error);
        return throwError(() => error);
      })
    );
  }

  putHuesped(huesped: HuespedRequest, huespedId: string): Observable<HuespedResponse> {
    return this.http.put<HuespedResponse>(`${this.apiUrl}/${huespedId}`, huesped).pipe(
      catchError(error => {
        console.error('Error al actualizar el huésped', error);
        return throwError(() => error);
      })
    );
  }

  deleteHuesped(huespedId: string): Observable<HuespedResponse> {
    return this.http.delete<HuespedResponse>(`${this.apiUrl}/${huespedId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el huésped', error);
        return throwError(() => error);
      })
    );
  }
}
