import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css'
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  showForm = false;
  isEditing = false;
  selectedUser: User = {
    nombre: '',
    email: '',
    telefono: '',
    rol: 'USER',
    estado: 'activo'
  };
  searchTerm = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Datos de ejemplo - luego conectaremos con la API
    this.users = [
      { id: 1, nombre: 'Juan García', email: 'juan@example.com', telefono: '600123456', rol: 'USER', estado: 'activo' },
      { id: 2, nombre: 'María López', email: 'maria@example.com', telefono: '600234567', rol: 'USER', estado: 'activo' },
      { id: 3, nombre: 'Carlos Martínez', email: 'carlos@example.com', telefono: '600345678', rol: 'ADMIN', estado: 'activo' }
    ];
  }

  openForm(user?: User): void {
    if (user) {
      this.isEditing = true;
      this.selectedUser = { ...user };
    } else {
      this.isEditing = false;
      this.selectedUser = {
        nombre: '',
        email: '',
        telefono: '',
        rol: 'USER',
        estado: 'activo'
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveUser(): void {
    if (this.isEditing && this.selectedUser.id) {
      const index = this.users.findIndex(u => u.id === this.selectedUser.id);
      if (index > -1) {
        this.users[index] = { ...this.selectedUser };
      }
    } else {
      this.selectedUser.id = Math.max(...this.users.map(u => u.id || 0)) + 1;
      this.users.push({ ...this.selectedUser });
    }
    this.closeForm();
  }

  deleteUser(id?: number): void {
    if (id && confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.users = this.users.filter(u => u.id !== id);
    }
  }

  toggleUserStatus(user: User): void {
    user.estado = user.estado === 'activo' ? 'inactivo' : 'activo';
  }

  get filteredUsers(): User[] {
    return this.users.filter(u =>
      u.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
