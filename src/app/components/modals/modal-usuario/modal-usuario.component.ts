import { Component, Inject } from '@angular/core';
import { UsuarioRequest } from '../../../models/Usuario.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-usuario',
  standalone: false,
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
})
export class ModalUsuarioComponent {
  usuario!: UsuarioRequest;

  usuarioForm!: FormGroup;

  constructor(
    private readonly dialogRef: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isEditar: boolean;
      username: string;
      password: string;
      roles: string[];
    },
  ) {
    this.usuarioForm = new FormGroup({
      username: new FormControl(this.data.username, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      password: new FormControl(this.data.password, [
        Validators.required,
        Validators.minLength(8),
      ]),
      roles: new FormControl(this.data.roles, [Validators.required]),
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  guardarCambios() {
    this.dialogRef.close(this.usuarioForm.value);
  }
}
