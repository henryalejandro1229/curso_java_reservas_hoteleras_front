import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HuespedRequest } from '../../../models/Huesped.model';

@Component({
  selector: 'app-modal-huespedes',
  standalone: false,
  templateUrl: './modal-huespedes.component.html',
  styleUrl: './modal-huespedes.component.css'
})
export class ModalHuespedesComponent {

  huespedForm: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<ModalHuespedesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isEditar: boolean;
      huesped: HuespedRequest;
    }
  ) {
    this.huespedForm = new FormGroup({
      nombre: new FormControl(this.data.huesped.nombre, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      apellidoPaterno: new FormControl(this.data.huesped.apellidoPaterno, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      apellidoMaterno: new FormControl(this.data.huesped.apellidoMaterno, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      nacionalidad: new FormControl(this.data.huesped.nacionalidad, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ]),
      email: new FormControl(this.data.huesped.email, [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]),
      telefono: new FormControl(this.data.huesped.telefono, [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]),
      documento: new FormControl(this.data.huesped.documento, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)
      ])
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  guardarCambios(): void {
    if (this.huespedForm.invalid) {
      this.huespedForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.huespedForm.value);
  }

  getErrorMessage(controlName: string): string {
    const control = this.huespedForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }

    if (control.errors['minlength']) {
      return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
    }

    if (control.errors['maxlength']) {
      return `No debe exceder ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    if (control.errors['email']) {
      return 'Debe tener un formato válido';
    }

    if (control.errors['pattern']) {
      return 'Debe contener exactamente 10 dígitos';
    }

    return '';
  }
}
