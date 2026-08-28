import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { HuespedRequest, HuespedResponse } from '../../models/Huesped.model';
import { HuepedesService } from '../../services/huepedes.service';
import { ModalHuespedesComponent } from '../modals/modal-huespedes/modal-huespedes.component';

@Component({
  selector: 'app-huepedes',
  standalone: false,
  templateUrl: './huepedes.component.html',
  styleUrl: './huepedes.component.css'
})
export class HuepedesComponent implements OnInit {

  huespedes: HuespedResponse[] = [];

  displayedColumns: string[] = [
    'no',
    'nombreCompleto',
    'nacionalidad',
    'email',
    'telefono',
    'documento',
    'acciones'
  ];

  dataSource = new MatTableDataSource<HuespedResponse>(this.huespedes);

  constructor(
    private dialog: MatDialog,
    private huepedesService: HuepedesService
  ) { }

  ngOnInit(): void {
    this.cargarHuespedes();
  }

  agregarHuesped(): void {
    const dialogRef = this.dialog.open(ModalHuespedesComponent, {
      data: {
        isEditar: false,
        huesped: this.getHuespedVacio()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearHuesped(result);
      }
    });
  }

  editarHuesped(huesped: HuespedResponse): void {
    const dialogRef = this.dialog.open(ModalHuespedesComponent, {
      data: {
        isEditar: true,
        huesped: { ...huesped }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actualizarHuesped(result, this.getHuespedId(huesped));
      }
    });
  }

  eliminarHuesped(huesped: HuespedResponse): void {
    const identificador = this.getHuespedId(huesped);
    const nombreCompleto = this.getNombreCompleto(huesped);

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el huésped ${nombreCompleto}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.huepedesService.deleteHuesped(identificador).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(item =>
              this.getHuespedId(item) !== identificador
            );
            Swal.fire('Eliminado', `El huésped ${nombreCompleto} fue eliminado.`, 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el huésped.', 'error');
          }
        });
      }
    });
  }

  getNombreCompleto(huesped: HuespedResponse): string {
    return `${huesped.nombre} ${huesped.apellidoPaterno} ${huesped.apellidoMaterno}`.trim();
  }

  private cargarHuespedes(): void {
    this.huepedesService.getHuespedes().subscribe(huespedes => {
      this.huespedes = huespedes;
      this.dataSource.data = huespedes;
    });
  }

  private crearHuesped(huesped: HuespedRequest): void {
    this.huepedesService.postHuesped(huesped).subscribe({
      next: () => {
        this.cargarHuespedes();
        Swal.fire('Huésped registrado', 'El huésped se creó correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar el huésped.', 'error');
      }
    });
  }

  private actualizarHuesped(huesped: HuespedRequest, huespedId: string): void {
    this.huepedesService.putHuesped(huesped, huespedId).subscribe({
      next: () => {
        this.cargarHuespedes();
        Swal.fire('Huésped actualizado', 'Los cambios se guardaron correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el huésped.', 'error');
      }
    });
  }

  private getHuespedVacio(): HuespedRequest {
    return {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      nacionalidad: '',
      email: '',
      telefono: '',
      documento: ''
    };
  }

  private getHuespedId(huesped: HuespedResponse): string {
    return String(huesped.id ?? huesped.documento);
  }
}
