import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioRequest, UsuarioResponse } from '../../models/Usuario.model';
import Swal from 'sweetalert2';
import { ModalUsuarioComponent } from '../modals/modal-usuario/modal-usuario.component';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioResponse[] = [];

  constructor(
    private dialog: MatDialog, private usuariosService: UsuariosService
  ) { }

  displayedColumns: string[] = ['no', 'username', 'roles', 'acciones'];
  dataSource = new MatTableDataSource<UsuarioResponse>(this.usuarios);

  ngOnInit() {
    this.cargarUsuarios();
  }

  editarUsuario(usuario: UsuarioResponse) {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      data: {
        isEditar: true,
        username: usuario.username,
        password: '',
        roles: usuario.roles
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actualizarUsuario(result, usuario.username);
      }
    });
  }

  eliminarUsuario(username: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el usuario ${username}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(username).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(user => user.username !== username);
            Swal.fire('Eliminado', `El usuario ${username} fue eliminado.`, 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
          }
        });
      }
    });
  }

  agregarUsuario() {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      data: {
        isEditar: false,
        username: '',
        password: '',
        roles: []
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearUsuario(result);
      }
    });
  }

  private cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.dataSource.data = usuarios;
    });
  }

  private crearUsuario(usuario: UsuarioRequest): void {
    this.usuariosService.postUsuario(usuario).subscribe({
      next: () => {
        this.cargarUsuarios();
        Swal.fire('Usuario registrado', 'El usuario se creó correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo registrar el usuario.', 'error');
      }
    });
  }

  private actualizarUsuario(usuario: UsuarioRequest, usernameOriginal: string): void {
    this.usuariosService.putUsuario(usuario, usernameOriginal).subscribe({
      next: () => {
        this.cargarUsuarios();
        Swal.fire('Usuario actualizado', 'Los cambios se guardaron correctamente.', 'success');
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
      }
    });
  }

  getRoleName(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_USER':
        return 'Usuario';
      default:
        return role;
    }
  }
}
