import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { UserResponseDTO } from '../../models/user-response-dto';
import { AyuntamientoService } from '../../services/ayuntamiento-service';
import { Ayuntamiento } from '../../models/ayuntamiento.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrls: ['../management-styles.css']
})
export class UsersManagementComponent implements OnInit {
  users: UserResponseDTO[] = [];
  ayuntamientos: Ayuntamiento[] = [];

  showForm = false;
  isEditing = false;
  searchTerm = '';
  saving = false;
  saveError = '';
  errorMsg = '';

  @Output() userChange = new EventEmitter<void>();

  selectedUser: any = this.resetUser();

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private ayuntamientoService: AyuntamientoService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadAyuntamientos();
  }

  resetUser() {
    return { nombre: '', apellidos: '', email: '', telefono: '', direccion: '', password: '', role: 'CLIENTE', ayuntamientoId: null };
  }

  loadUsers(): void {
    this.errorMsg = '';
    this.userService.getUsers().subscribe({
      next: (data) => { this.users = data; this.cdr.detectChanges(); },
      error: (err) => { this.errorMsg = 'Error cargando usuarios: ' + (err?.error?.message || err?.message || 'Error desconocido'); this.cdr.detectChanges(); }
    });
  }

  loadAyuntamientos(): void {
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (data) => { this.ayuntamientos = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando ayuntamientos:', err)
    });
  }

  openForm(user?: UserResponseDTO): void {
    this.saveError = '';
    if (user) {
      this.isEditing = true;
      this.selectedUser = { ...user, password: '' };
    } else {
      this.isEditing = false;
      this.selectedUser = this.resetUser();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.saveError = '';
  }

  saveUser(): void {
    if (!this.selectedUser.nombre || !this.selectedUser.email) {
      this.saveError = 'El nombre y email son obligatorios.';
      return;
    }
    if (!this.isEditing && !this.selectedUser.password) {
      this.saveError = 'La contraseña es obligatoria al crear un usuario.';
      return;
    }

    this.saving = true;
    this.saveError = '';

    const payload: any = {
      nombre: this.selectedUser.nombre,
      apellidos: this.selectedUser.apellidos || '',
      email: this.selectedUser.email,
      telefono: this.selectedUser.telefono || '',
      direccion: this.selectedUser.direccion || '',
      role: this.selectedUser.role,
      ayuntamientoId: this.selectedUser.ayuntamientoId
    };

    // Solo incluir password si tiene valor
    if (this.selectedUser.password) {
      payload.password = this.selectedUser.password;
    }

    if (this.isEditing && this.selectedUser.id) {
      this.userService.updateUser(this.selectedUser.id, payload).subscribe({
        next: () => { this.saving = false; this.loadUsers(); this.userChange.emit(); this.closeForm(); },
        error: (e) => { this.saving = false; this.saveError = 'Error al actualizar: ' + (e?.error?.message || e?.message || 'Error del servidor'); this.cdr.detectChanges(); }
      });
    } else {
      if (!payload.password) { this.saveError = 'La contraseña es obligatoria.'; this.saving = false; return; }
      this.userService.createUser(payload).subscribe({
        next: () => { this.saving = false; this.loadUsers(); this.userChange.emit(); this.closeForm(); },
        error: (e) => { this.saving = false; this.saveError = 'Error al crear: ' + (e?.error?.message || e?.message || 'Error del servidor'); this.cdr.detectChanges(); }
      });
    }
  }

  deleteUser(id?: number): void {
    if (id && confirm('¿Eliminar usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => { this.loadUsers(); this.userChange.emit(); },
        error: (e) => { this.errorMsg = 'Error al eliminar: ' + (e?.error?.message || e?.message || ''); this.cdr.detectChanges(); }
      });
    }
  }

  get filteredUsers(): UserResponseDTO[] {
    const searchTerm = this.searchTerm.toLowerCase();
    return this.users.filter(u =>
      (u.nombre && u.nombre.toLowerCase().includes(searchTerm)) ||
      (u.email && u.email.toLowerCase().includes(searchTerm))
    );
  }
}
