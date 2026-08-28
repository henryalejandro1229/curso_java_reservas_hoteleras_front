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
      fechaEntrada: new FormControl(this.data.reserva?.fechaEntrada ?? '', [Validators.required]),
      fechaSalida: new FormControl(this.data.reserva?.fechaSalida ?? '', [Validators.required])
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
      fechaEntrada: this.reservaForm.value.fechaEntrada,
      fechaSalida: this.reservaForm.value.fechaSalida
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

    return new Date(fechaSalida).getTime() < new Date(fechaEntrada).getTime();
  }

  getNombreHuesped(huesped: HuespedResponse): string {
    return `${huesped.nombre} ${huesped.apellidoPaterno} ${huesped.apellidoMaterno}`.trim();
  }

}
