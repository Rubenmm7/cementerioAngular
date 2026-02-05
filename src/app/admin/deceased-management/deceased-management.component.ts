import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Deceased {
  id?: number;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  fechaFallecimiento: string;
  cementerio: string;
  parcela: string;
  responsable: string;
  telefono: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-deceased-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deceased-management.component.html',
  styleUrl: './deceased-management.component.css'
})
export class DeceasedManagementComponent implements OnInit {
  deceased: Deceased[] = [];
  showForm = false;
  isEditing = false;
  selectedDeceased: Deceased = {
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    fechaFallecimiento: '',
    cementerio: '',
    parcela: '',
    responsable: '',
    telefono: '',
    estado: 'activo'
  };
  searchTerm = '';

  ngOnInit(): void {
    this.loadDeceased();
  }

  loadDeceased(): void {
    this.deceased = [
      {
        id: 1,
        nombre: 'José',
        apellidos: 'García López',
        fechaNacimiento: '1945-03-15',
        fechaFallecimiento: '2023-11-20',
        cementerio: 'Cementerio Central',
        parcela: 'A-125',
        responsable: 'Juan García',
        telefono: '600123456',
        estado: 'activo'
      },
      {
        id: 2,
        nombre: 'María',
        apellidos: 'Rodríguez García',
        fechaNacimiento: '1950-07-22',
        fechaFallecimiento: '2024-02-10',
        cementerio: 'Cementerio del Norte',
        parcela: 'B-87',
        responsable: 'Carlos Rodríguez',
        telefono: '600234567',
        estado: 'activo'
      }
    ];
  }

  openForm(item?: Deceased): void {
    if (item) {
      this.isEditing = true;
      this.selectedDeceased = { ...item };
    } else {
      this.isEditing = false;
      this.selectedDeceased = {
        nombre: '',
        apellidos: '',
        fechaNacimiento: '',
        fechaFallecimiento: '',
        cementerio: '',
        parcela: '',
        responsable: '',
        telefono: '',
        estado: 'activo'
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveDeceased(): void {
    if (this.isEditing && this.selectedDeceased.id) {
      const index = this.deceased.findIndex(d => d.id === this.selectedDeceased.id);
      if (index > -1) {
        this.deceased[index] = { ...this.selectedDeceased };
      }
    } else {
      this.selectedDeceased.id = Math.max(...this.deceased.map(d => d.id || 0)) + 1;
      this.deceased.push({ ...this.selectedDeceased });
    }
    this.closeForm();
  }

  deleteDeceased(id?: number): void {
    if (id && confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.deceased = this.deceased.filter(d => d.id !== id);
    }
  }

  getAge(fechaNacimiento: string): number {
    const birth = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  get filteredDeceased(): Deceased[] {
    return this.deceased.filter(d =>
      (d.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       d.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       d.parcela.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}
