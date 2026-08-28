export interface HabitacionRequest {
  numero: number;
  idTipoHabitacion: number;
  capacidad: number;
  precio: number;
}

export interface HabitacionResponse {
  id: number;
  numero: number;
  tipo: string;
  idTipo: number;
  capacidad: number;
  precio: number;
  estadoHabitacion: string;
  idEstadoHabitacion: number;
}
