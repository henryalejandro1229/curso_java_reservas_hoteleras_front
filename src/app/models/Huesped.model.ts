export interface HuespedRequest {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nacionalidad: string;
  email: string;
  telefono: string;
  documento: string;
}

export interface HuespedResponse extends HuespedRequest {
  id?: number | string;
}