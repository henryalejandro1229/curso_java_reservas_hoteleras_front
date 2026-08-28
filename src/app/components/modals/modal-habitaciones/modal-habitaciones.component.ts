import { Component, ElementRef, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HabitacionRequest } from '../../../models/Habitacion.model';

interface TipoHabitacionOption {
  id: number;
  nombre: string;
}

interface HabitacionFormControls {
  numero: FormControl<number | null>;
  idTipoHabitacion: FormControl<number | null>;
  capacidad: FormControl<number | null>;
  precio: FormControl<number | null>;
}

export interface ModalHabitacionesData {
  isEditar: boolean;
  habitacion: HabitacionRequest;
}

const TIPOS_HABITACION_VALIDOS = [1, 2, 3] as const;

function esEntero(control: AbstractControl<number | null>): ValidationErrors | null {
  const valor = control.value;

  if (valor === null) {
    return null;
  }

  return Number.isInteger(valor) ? null : { entero: true };
}

function perteneceA(valoresPermitidos: readonly number[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value as number | null;

    if (valor === null) {
      return null;
    }

    return valoresPermitidos.includes(valor) ? null : { opcionInvalida: true };
  };
}

function valorInicial(valor: number): number | null {
  return valor > 0 ? valor : null;
}

@Component({
  selector: 'app-modal-habitaciones',
  standalone: false,
  templateUrl: './modal-habitaciones.component.html',
  styleUrl: './modal-habitaciones.component.css'
})
export class ModalHabitacionesComponent {

  readonly tiposHabitacion: readonly TipoHabitacionOption[] = [
    { id: 1, nombre: 'Sencilla' },
    { id: 2, nombre: 'Doble' },
    { id: 3, nombre: 'Suite' }
  ];

  readonly habitacionForm: FormGroup<HabitacionFormControls>;
  mostrarResumenErrores = false;

  constructor(
    private readonly dialogRef: MatDialogRef<ModalHabitacionesComponent>,
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ModalHabitacionesData
  ) {
    this.habitacionForm = new FormGroup<HabitacionFormControls>({
      numero: new FormControl<number | null>(valorInicial(data.habitacion.numero), [
        Validators.required,
        Validators.min(1),
        Validators.max(32767),
        esEntero
      ]),
      idTipoHabitacion: new FormControl<number | null>(
        valorInicial(data.habitacion.idTipoHabitacion),
        [
          Validators.required,
          perteneceA(TIPOS_HABITACION_VALIDOS)
        ]
      ),
      capacidad: new FormControl<number | null>(valorInicial(data.habitacion.capacidad), [
        Validators.required,
        Validators.min(1),
        Validators.max(10),
        esEntero
      ]),
      precio: new FormControl<number | null>(valorInicial(data.habitacion.precio), [
        Validators.required,
        Validators.min(0.01),
        Validators.max(99999999.99),
        Validators.pattern(/^\d+(?:\.\d{1,2})?$/)
      ])
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  guardarCambios(): void {
    if (this.habitacionForm.invalid) {
      this.mostrarResumenErrores = true;
      this.habitacionForm.markAllAsTouched();
      queueMicrotask(() => {
        this.elementRef.nativeElement
          .querySelector<HTMLElement>('input.ng-invalid, mat-select.ng-invalid')
          ?.focus();
      });
      return;
    }

    this.mostrarResumenErrores = false;

    const { numero, idTipoHabitacion, capacidad, precio } =
      this.habitacionForm.getRawValue();

    if (
      numero === null ||
      idTipoHabitacion === null ||
      capacidad === null ||
      precio === null
    ) {
      return;
    }

    const habitacion: HabitacionRequest = {
      numero,
      idTipoHabitacion,
      capacidad,
      precio
    };

    this.dialogRef.close(habitacion);
  }

  getErrorMessage(controlName: keyof HabitacionFormControls): string {
    const control = this.habitacionForm.controls[controlName];

    if (!control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (control.errors['entero']) {
      return 'Debe ser un número entero';
    }

    if (control.errors['opcionInvalida']) {
      return 'Selecciona un tipo de habitación válido';
    }

    if (control.errors['min']) {
      return controlName === 'precio'
        ? 'El precio debe ser mayor que cero'
        : `El valor mínimo es ${control.errors['min'].min}`;
    }

    if (control.errors['max']) {
      return `El valor máximo es ${control.errors['max'].max}`;
    }

    if (control.errors['pattern']) {
      return 'Ingresa un precio con máximo 2 decimales';
    }

    return 'Revisa el valor ingresado';
  }
}
