import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import {
  HabitacionRequest,
  HabitacionResponse
} from '../../models/Habitacion.model';
import { HabitacionesService } from '../../services/habitaciones.service';
import { ModalHabitacionesComponent } from '../modals/modal-habitaciones/modal-habitaciones.component';

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent implements OnInit {

  readonly displayedColumns: string[] = [
    'no',
    'numero',
    'tipo',
    'capacidad',
    'precio',
    'estadoHabitacion',
    'acciones'
  ];

  readonly dataSource = new MatTableDataSource<HabitacionResponse>([]);

  cargando = false;
  errorCarga = false;
  operacionEnCurso = false;
  modalAbierto = false;

  private borradorAlta: HabitacionRequest | null = null;
  private readonly borradoresEdicion = new Map<number, HabitacionRequest>();

  constructor(
    private readonly dialog: MatDialog,
    private readonly habitacionesService: HabitacionesService
  ) { }

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  agregarHabitacion(): void {
    if (this.operacionEnCurso || this.modalAbierto) {
      return;
    }

    this.modalAbierto = true;
    const dialogRef = this.dialog.open(ModalHabitacionesComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        isEditar: false,
        habitacion: { ...(this.borradorAlta ?? this.getHabitacionVacia()) }
      }
    });

    dialogRef.afterClosed().pipe(
      finalize(() => {
        this.modalAbierto = false;
      })
    ).subscribe((habitacion?: HabitacionRequest) => {
      if (habitacion) {
        this.borradorAlta = { ...habitacion };
        this.crearHabitacion(habitacion);
      } else {
        this.borradorAlta = null;
      }
    });
  }

  editarHabitacion(habitacion: HabitacionResponse): void {
    const habitacionId = this.getHabitacionId(habitacion);

    if (habitacionId === null || this.operacionEnCurso || this.modalAbierto) {
      return;
    }

    this.modalAbierto = true;
    const dialogRef = this.dialog.open(ModalHabitacionesComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        isEditar: true,
        habitacion: {
          ...(this.borradoresEdicion.get(habitacionId) ??
            this.responseARequest(habitacion))
        }
      }
    });

    dialogRef.afterClosed().pipe(
      finalize(() => {
        this.modalAbierto = false;
      })
    ).subscribe((cambios?: HabitacionRequest) => {
      if (cambios) {
        this.borradoresEdicion.set(habitacionId, { ...cambios });
        this.actualizarHabitacion(cambios, habitacionId);
      } else {
        this.borradoresEdicion.delete(habitacionId);
      }
    });
  }

  eliminarHabitacion(habitacion: HabitacionResponse): void {
    const habitacionId = this.getHabitacionId(habitacion);

    if (habitacionId === null || this.operacionEnCurso || this.modalAbierto) {
      return;
    }

    void Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la habitación ${habitacion.numero}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) {
        return;
      }

      this.operacionEnCurso = true;
      this.habitacionesService.deleteHabitacion(habitacionId).pipe(
        finalize(() => {
          this.operacionEnCurso = false;
        })
      ).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            item => item.id !== habitacionId
          );
          this.borradoresEdicion.delete(habitacionId);
          void Swal.fire(
            'Habitación eliminada',
            `La habitación ${habitacion.numero} fue eliminada.`,
            'success'
          );
        },
        // El interceptor global conserva y muestra el mensaje de negocio.
        error: () => undefined
      });
    });
  }

  tieneIdValido(habitacion: HabitacionResponse): boolean {
    return this.getHabitacionId(habitacion) !== null;
  }

  getEstadoClase(habitacion: HabitacionResponse): string {
    switch (habitacion.idEstadoHabitacion) {
      case 1:
        return 'estado-disponible';
      case 2:
        return 'estado-ocupada';
      case 3:
        return 'estado-limpieza';
      case 4:
        return 'estado-mantenimiento';
      default:
        return 'estado-desconocido';
    }
  }

  reintentarCarga(): void {
    if (!this.cargando) {
      this.cargarHabitaciones();
    }
  }

  private cargarHabitaciones(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.habitacionesService.getHabitaciones().pipe(
      finalize(() => {
        this.cargando = false;
      })
    ).subscribe({
      next: habitaciones => {
        this.dataSource.data = this.ordenarPorNumero(habitaciones);
      },
      error: () => {
        this.errorCarga = true;
      }
    });
  }

  private crearHabitacion(habitacion: HabitacionRequest): void {
    this.operacionEnCurso = true;

    this.habitacionesService.postHabitacion(habitacion).pipe(
      finalize(() => {
        this.operacionEnCurso = false;
      })
    ).subscribe({
      next: () => {
        this.borradorAlta = null;
        this.cargarHabitaciones();
        void Swal.fire(
          'Habitación registrada',
          'La habitación se creó correctamente.',
          'success'
        );
      },
      // El interceptor global conserva y muestra el mensaje de negocio.
      error: () => undefined
    });
  }

  private actualizarHabitacion(
    habitacion: HabitacionRequest,
    habitacionId: number
  ): void {
    this.operacionEnCurso = true;

    this.habitacionesService.putHabitacion(habitacion, habitacionId).pipe(
      finalize(() => {
        this.operacionEnCurso = false;
      })
    ).subscribe({
      next: () => {
        this.borradoresEdicion.delete(habitacionId);
        this.cargarHabitaciones();
        void Swal.fire(
          'Habitación actualizada',
          'Los cambios se guardaron correctamente.',
          'success'
        );
      },
      // El interceptor global conserva y muestra el mensaje de negocio.
      error: () => undefined
    });
  }

  private responseARequest(habitacion: HabitacionResponse): HabitacionRequest {
    return {
      numero: habitacion.numero,
      idTipoHabitacion: habitacion.idTipo,
      capacidad: habitacion.capacidad,
      precio: habitacion.precio
    };
  }

  private ordenarPorNumero(
    habitaciones: readonly HabitacionResponse[]
  ): HabitacionResponse[] {
    return [...habitaciones].sort((a, b) => a.numero - b.numero);
  }

  private getHabitacionVacia(): HabitacionRequest {
    return {
      numero: 0,
      idTipoHabitacion: 0,
      capacidad: 0,
      precio: 0
    };
  }

  private getHabitacionId(habitacion: HabitacionResponse): number | null {
    return Number.isInteger(habitacion.id) && habitacion.id > 0
      ? habitacion.id
      : null;
  }
}
