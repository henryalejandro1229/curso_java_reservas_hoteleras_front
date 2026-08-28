import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ModalReservasComponent } from '../modals/modal-reservas/modal-reservas.component';
import { ReservaRequest, ReservaResponse } from '../../models/Reservas.model';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-reservas',
  standalone: false,
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {

  filtro = '';
  cargando = false;
  errorCarga = false;
  operacionEnCurso = false;
  modalAbierto = false;
  readonly displayedColumns: string[] = [
    'no',
    'huesped',
    'habitacion',
    'fechaReserva',
    'fechaEntrada',
    'fechaSalida',
    'estado',
    'acciones'
  ];
  readonly dataSource = new MatTableDataSource<ReservaResponse>([]);

  constructor(
    private readonly dialog: MatDialog,
    private readonly reservasService: ReservasService
  ) { }

  ngOnInit(): void {
    this.cargarReservas();
    this.dataSource.filterPredicate = (reserva, filtro) => {
      const valor = filtro.trim().toLowerCase();
      return [
        this.getNombreHuesped(reserva),
        this.getNombreHabitacion(reserva),
        reserva.estadoReserva ?? '',
        reserva.fechaReserva ?? '',
        reserva.fechaEntrada,
        reserva.fechaSalida
      ].join(' ').toLowerCase().includes(valor);
    };
  }

  agregarReserva(): void {
    if (this.cargando || this.operacionEnCurso || this.modalAbierto) {
      return;
    }

    this.modalAbierto = true;
    const dialogRef = this.dialog.open(ModalReservasComponent, {
      width: '620px',
      maxWidth: '95vw',
      data: {
        isEditar: false,
        reserva: null
      }
    });

    dialogRef.afterClosed().pipe(
      finalize(() => {
        this.modalAbierto = false;
      })
    ).subscribe((result?: ReservaRequest) => {
      if (result) {
        this.crearReserva(result);
      }
    });
  }

  editarReserva(reserva: ReservaResponse): void {
    if (this.cargando || this.operacionEnCurso || this.modalAbierto) {
      return;
    }

    this.modalAbierto = true;
    const dialogRef = this.dialog.open(ModalReservasComponent, {
      width: '620px',
      maxWidth: '95vw',
      data: {
        isEditar: true,
        reserva
      }
    });

    dialogRef.afterClosed().pipe(
      finalize(() => {
        this.modalAbierto = false;
      })
    ).subscribe((result?: ReservaRequest) => {
      if (result) {
        this.actualizarReserva(result, String(reserva.id ?? reserva.idReserva));
      }
    });
  }

  eliminarReserva(reserva: ReservaResponse): void {
    if (this.cargando || this.operacionEnCurso || this.modalAbierto) {
      return;
    }

    const reservaId = String(reserva.id ?? reserva.idReserva);
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la reserva ${reservaId}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.operacionEnCurso = true;
        this.reservasService.deleteReserva(reservaId).pipe(
          finalize(() => {
            this.operacionEnCurso = false;
          })
        ).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(item =>
              String(item.id ?? item.idReserva) !== reservaId
            );
            Swal.fire('Eliminada', 'La reserva fue eliminada correctamente.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la reserva.', 'error');
          }
        });
      }
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro;
  }

  reintentarCarga(): void {
    if (!this.cargando) {
      this.cargarReservas();
    }
  }

  getNombreHuesped(reserva: ReservaResponse): string {
    if (reserva.nombreHuesped) {
      return reserva.nombreHuesped;
    }

    const nombre = reserva.huesped?.nombre ?? '';
    const apellido = reserva.huesped?.apellido ?? '';
    return `${nombre} ${apellido}`.trim() || `Huésped #${reserva.idHuesped}`;
  }

  getNombreHabitacion(reserva: ReservaResponse): string {
    const numero = reserva.numeroHabitacion ?? reserva.habitacion?.numero;
    const tipo = reserva.habitacion?.tipo;

    if (numero && tipo) {
      return `Habitación ${numero} - ${tipo}`;
    }

    if (numero) {
      return `Habitación ${numero}`;
    }

    if (tipo) {
      return tipo;
    }

    return reserva.nombreHabitacion || `Habitación #${reserva.idHabitacion}`;
  }

  private cargarReservas(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.reservasService.getReservas().pipe(
      finalize(() => {
        this.cargando = false;
      })
    ).subscribe({
      next: reservas => {
        this.dataSource.data = reservas;
      },
      error: () => {
        this.errorCarga = true;
      }
    });
  }

  private crearReserva(reserva: ReservaRequest): void {
    this.operacionEnCurso = true;

    this.reservasService.postReserva(reserva).pipe(
      finalize(() => {
        this.operacionEnCurso = false;
      })
    ).subscribe({
      next: () => {
        this.cargarReservas();
        Swal.fire('Reserva registrada', 'La reserva se creó correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar la reserva.', 'error');
      }
    });
  }

  private actualizarReserva(reserva: ReservaRequest, reservaId: string): void {
    this.operacionEnCurso = true;

    this.reservasService.putReserva(reserva, reservaId).pipe(
      finalize(() => {
        this.operacionEnCurso = false;
      })
    ).subscribe({
      next: () => {
        this.cargarReservas();
        Swal.fire('Reserva actualizada', 'Los cambios se guardaron correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar la reserva.', 'error');
      }
    });
  }

}
