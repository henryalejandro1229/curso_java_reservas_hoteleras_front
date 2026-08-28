import { Component, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioRequest } from '../../../models/Usuario.model';

interface UsuarioFormControls {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  roles: FormControl<string[] | null>;
}

@Component({
  selector: 'app-modal-usuario',
  standalone: false,
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
})
export class ModalUsuarioComponent {
  readonly usuarioForm: FormGroup<UsuarioFormControls>;
  mostrarResumenErrores = false;

  constructor(
    private readonly dialogRef: MatDialogRef<ModalUsuarioComponent>,
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isEditar: boolean;
      username: string;
      password: string;
      roles: string[];
    },
  ) {
    this.usuarioForm = new FormGroup<UsuarioFormControls>({
      username: new FormControl<string | null>(this.data.username, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      password: new FormControl<string | null>(this.data.password, [
        Validators.required,
        Validators.minLength(8),
      ]),
      roles: new FormControl<string[] | null>(this.data.roles, [Validators.required]),
    });
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }

  guardarCambios(): void {
    if (this.usuarioForm.invalid) {
      this.mostrarResumenErrores = true;
      this.usuarioForm.markAllAsTouched();
      queueMicrotask(() => {
        this.elementRef.nativeElement
          .querySelector<HTMLElement>('input.ng-invalid, mat-select.ng-invalid')
          ?.focus();
      });
      return;
    }

    this.mostrarResumenErrores = false;
    const { username, password, roles } = this.usuarioForm.getRawValue();

    if (!username || !password || !roles) {
      return;
    }

    const usuario: UsuarioRequest = { username, password, roles };
    this.dialogRef.close(usuario);
  }

  getErrorMessage(controlName: keyof UsuarioFormControls): string {
    const control = this.usuarioForm.controls[controlName];

    if (!control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (control.errors['minlength']) {
      return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
    }

    if (control.errors['maxlength']) {
      return `No debe exceder ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Revisa el valor ingresado';
  }
}
