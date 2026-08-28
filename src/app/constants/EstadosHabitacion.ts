export const ESTADOS_HABITACION = {
  DISPONIBLE: 1,
  OCUPADA: 2,
  LIMPIEZA: 3,
  MANTENIMIENTO: 4
} as const;

export const CLASES_ESTADO_HABITACION: Record<number, string> = {
  [ESTADOS_HABITACION.DISPONIBLE]: 'estado-disponible',
  [ESTADOS_HABITACION.OCUPADA]: 'estado-ocupada',
  [ESTADOS_HABITACION.LIMPIEZA]: 'estado-limpieza',
  [ESTADOS_HABITACION.MANTENIMIENTO]: 'estado-mantenimiento'
};

export const CLASE_ESTADO_HABITACION_DESCONOCIDO = 'estado-desconocido';