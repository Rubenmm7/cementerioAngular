import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DifuntoService } from '../../services/difunto-service';

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
  styleUrls: ['../management-styles.css']
})

export class DeceasedManagementComponent implements OnInit {
  deceased: Deceased[] = [];
  showForm = false;
  isEditing = false;

  @Output() deceasedChange = new EventEmitter<void>();

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

  constructor(
    private difuntoService: DifuntoService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.loadDeceased();
  }

  loadDeceased(): void {
    this.difuntoService.getDifuntos().subscribe({
      next: (data) => {
        this.deceased = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e)
    });
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
    const operation = this.isEditing && this.selectedDeceased.id
      ? this.difuntoService.updateDifunto(this.selectedDeceased.id, this.selectedDeceased)
      : this.difuntoService.createDifunto(this.selectedDeceased);

    operation.subscribe({
      next: () => {
        this.loadDeceased();
        this.deceasedChange.emit();
        this.closeForm();
      },
      error: (err) => console.error("Error guardando difunto:", err)
    });
  }

  deleteDeceased(id?: number): void {
    if (id && confirm('¿Eliminar registro?')) {
      this.difuntoService.deleteDifunto(id).subscribe({
        next: () => {
          this.loadDeceased();
          this.deceasedChange.emit();
        },
        error: (err) => console.error("Error eliminando difunto:", err)
      });
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
