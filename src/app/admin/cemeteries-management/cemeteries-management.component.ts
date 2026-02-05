import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Cemetery {
  id?: number;
  nombre: string;
  ubicacion: string;
  telefono: string;
  email: string;
  capacidad: number;
  ocupacion: number;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-cemeteries-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cemeteries-management.component.html',
  styleUrl: './cemeteries-management.component.css'
})
export class CemeteriesManagementComponent implements OnInit {
  cemeteries: Cemetery[] = [];
  showForm = false;
  isEditing = false;
  selectedCemetery: Cemetery = {
    nombre: '',
    ubicacion: '',
    telefono: '',
    email: '',
    capacidad: 1000,
    ocupacion: 0,
    estado: 'activo'
  };
  searchTerm = '';

  ngOnInit(): void {
    this.loadCemeteries();
  }

  loadCemeteries(): void {
    this.cemeteries = [
      { 
        id: 1, 
        nombre: 'Cementerio Central', 
        ubicacion: 'Calle Principal 123', 
        telefono: '912345678', 
        email: 'central@cemetery.com',
        capacidad: 2000,
        ocupacion: 1450,
        estado: 'activo'
      },
      { 
        id: 2, 
        nombre: 'Cementerio del Norte', 
        ubicacion: 'Avenida Norte 456', 
        telefono: '912345679', 
        email: 'norte@cemetery.com',
        capacidad: 1500,
        ocupacion: 890,
        estado: 'activo'
      },
      { 
        id: 3, 
        nombre: 'Cementerio Privado San José', 
        ubicacion: 'Carretera Sur Km 10', 
        telefono: '912345680', 
        email: 'sanjose@cemetery.com',
        capacidad: 800,
        ocupacion: 420,
        estado: 'activo'
      }
    ];
  }

  openForm(cemetery?: Cemetery): void {
    if (cemetery) {
      this.isEditing = true;
      this.selectedCemetery = { ...cemetery };
    } else {
      this.isEditing = false;
      this.selectedCemetery = {
        nombre: '',
        ubicacion: '',
        telefono: '',
        email: '',
        capacidad: 1000,
        ocupacion: 0,
        estado: 'activo'
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveCemetery(): void {
    if (this.isEditing && this.selectedCemetery.id) {
      const index = this.cemeteries.findIndex(c => c.id === this.selectedCemetery.id);
      if (index > -1) {
        this.cemeteries[index] = { ...this.selectedCemetery };
      }
    } else {
      this.selectedCemetery.id = Math.max(...this.cemeteries.map(c => c.id || 0)) + 1;
      this.cemeteries.push({ ...this.selectedCemetery });
    }
    this.closeForm();
  }

  deleteCemetery(id?: number): void {
    if (id && confirm('¿Estás seguro de que deseas eliminar este cementerio?')) {
      this.cemeteries = this.cemeteries.filter(c => c.id !== id);
    }
  }

  getOccupancyPercentage(cemetery: Cemetery): number {
    return Math.round((cemetery.ocupacion / cemetery.capacidad) * 100);
  }

  get filteredCemeteries(): Cemetery[] {
    return this.cemeteries.filter(c =>
      c.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.ubicacion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
