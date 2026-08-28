export interface ReservaRequest {
  idHuesped: number;
  idHabitacion: number;
  fechaEntrada: string;
  fechaSalida: string;
}

export interface ReservaResponse extends ReservaRequest {
  idHuesped: number;
  idHabitacion: number;
  id?: number;
  idReserva?: number;
  estadoReserva?: string;
  fechaReserva?: string;
  fechaCancelacion?: string;
  nombreHuesped?: string;
  nombreHabitacion?: string;
  numeroHabitacion?: string;
  huesped?: {
    id?: number;
    nombre?: string;
    apellido?: string;
  };
  habitacion?: {
    id?: number;
    nombre?: string;
    numero?: string | number;
    tipo?: string;
  };
}

export interface HabitacionOption {
  id: number;
  nombre: string;
  descripcion: string;
}
