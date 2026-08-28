import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HuespedResponse } from '../../../models/Huesped.model';
import { HabitacionOption, ReservaRequest, ReservaResponse } from '../../../models/Reservas.model';
import { HuepedesService } from '../../../services/huepedes.service';
import { ReservasService } from '../../../services/reservas.service';

@Component({
  selector: 'app-modal-reservas',
  standalone: false,
  templateUrl: './modal-reservas.component.html',
  styleUrl: './modal-reservas.component.css'
})
export class ModalReservasComponent implements OnInit {
  reservaForm: FormGroup;
  huespedes: HuespedResponse[] = [];
  habitaciones: HabitacionOption[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<ModalReservasComponent>,
    private readonly huespedesService: HuepedesService,
    private readonly reservasService: ReservasService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isEditar: boolean;
      reserva: ReservaResponse | null;
    }
  ) {
    this.reservaForm = new FormGroup({
      idHuesped: new FormControl<number | null>(this.data.reserva?.idHuesped ?? null, [Validators.required]),
      idHabitacion: new FormControl<number | null>(this.data.reserva?.idHabitacion ?? null, [Validators.required]),
      fechaEntrada: new FormControl<Date | null>(this.parseFecha(this.data.reserva?.fechaEntrada), [Validators.required]),
      fechaSalida: new FormControl<Date | null>(this.parseFecha(this.data.reserva?.fechaSalida), [Validators.required]),
      horaEntrada: new FormControl(this.parseHora(this.data.reserva?.fechaEntrada), [Validators.required]),
      horaSalida: new FormControl(this.parseHora(this.data.reserva?.fechaSalida), [Validators.required])
    });
  }

  ngOnInit(): void {
    this.cargarHuespedes();
    this.cargarHabitaciones();
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  guardarCambios(): void {
    if (this.reservaForm.invalid || this.fechasInvalidas()) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    const reserva: ReservaRequest = {
      idHuesped: this.reservaForm.value.idHuesped,
      idHabitacion: this.reservaForm.value.idHabitacion,
      fechaEntrada: this.formatFechaHora(this.reservaForm.value.fechaEntrada, this.reservaForm.value.horaEntrada),
      fechaSalida: this.formatFechaHora(this.reservaForm.value.fechaSalida, this.reservaForm.value.horaSalida)
    };

    this.dialogRef.close(reserva);
  }

  private cargarHuespedes(): void {
    this.huespedesService.getHuespedes().subscribe(huespedes => {
      this.huespedes = huespedes;
    });
  }

  private cargarHabitaciones(): void {
    this.reservasService.getHabitaciones().subscribe(habitaciones => {
      this.habitaciones = habitaciones;
    });
  }

  fechasInvalidas(): boolean {
    const fechaEntrada = this.reservaForm.value.fechaEntrada;
    const fechaSalida = this.reservaForm.value.fechaSalida;

    if (!fechaEntrada || !fechaSalida) {
      return false;
    }

    const entrada = this.combinarFechaHora(fechaEntrada, this.reservaForm.value.horaEntrada);
    const salida = this.combinarFechaHora(fechaSalida, this.reservaForm.value.horaSalida);
    return salida.getTime() < entrada.getTime();
  }

  getNombreHuesped(huesped: HuespedResponse): string {
    return `${huesped.nombre} ${huesped.apellidoPaterno} ${huesped.apellidoMaterno}`.trim();
  }

  private parseFecha(fecha: string | undefined): Date | null {
    if (!fecha) {
      return null;
    }

    const fechaParte = fecha.substring(0, 10);
    const partes = fechaParte.includes('/')
      ? fechaParte.split('/').map(Number)
      : fechaParte.split('-').map(Number).reverse();
    const [day, month, year] = fechaParte.includes('/')
      ? partes
      : [partes[0], partes[1], partes[2]];
    const resultado = new Date(year, month - 1, day);
    const hora = this.parseHora(fecha);

    if (hora) {
      const [hours, minutes] = hora.split(':').map(Number);
      resultado.setHours(hours, minutes, 0, 0);
    }

    return resultado;
  }

  private parseHora(fecha: string | undefined): string {
    return fecha?.substring(11, 16) || '00:00';
  }

  private combinarFechaHora(fecha: Date, hora: string | undefined): Date {
    const [hours, minutes] = (hora || '00:00').split(':').map(Number);
    const resultado = new Date(fecha);
    resultado.setHours(hours, minutes, 0, 0);
    return resultado;
  }

  private formatFechaHora(fecha: Date | null | undefined, hora: string | undefined): string {
    if (!fecha || !hora) {
      return '';
    }

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${day}/${month}/${year} ${hora}`;
  }

}
