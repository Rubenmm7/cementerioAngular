import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DifuntoService } from '../../services/difunto-service';
import { Difunto } from '../../models/difunto.model';

@Component({
  selector: 'app-deceased-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deceased-management.component.html',
  styleUrls: ['../management-styles.css']
})
export class DeceasedManagementComponent implements OnInit {
  
  deceased: Difunto[] = [];
  showForm = false;
  isEditing = false;
  searchTerm = '';

  @Output() deceasedChange = new EventEmitter<void>();

  selectedDeceased: Difunto = this.resetDeceased();

  constructor(
    private difuntoService: DifuntoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDeceased();
  }

  resetDeceased(): Difunto {
    return {
      id: 0,
      nombre: '',
      apellidos: '',
      dni: '',
      fechaNacimiento: '',
      fechaDefuncion: '',
      fechaEnterramiento: '',
      biografia: '',
      parcelaId: undefined,
      nombreCementerio: ''
    };
  }

  loadDeceased(): void {
    this.difuntoService.getDifuntos().subscribe({
      next: (data) => {
        this.deceased = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando difuntos', e)
    });
  }

  openForm(item?: Difunto): void {
    if (item) {
      this.isEditing = true;
      this.selectedDeceased = { ...item };
    } else {
      this.isEditing = false;
      this.selectedDeceased = this.resetDeceased();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

saveDeceased(): void {
    // Si necesitas validaciones (ej: DNI obligatorio), ponlas aquí
    if (!this.selectedDeceased.nombre || !this.selectedDeceased.apellidos) {
        alert("Nombre y Apellidos son obligatorios");
        return;
    }

    if (this.isEditing && this.selectedDeceased.id) {
      // MODO EDICIÓN: Enviamos el ID
      this.difuntoService.updateDifunto(this.selectedDeceased.id, this.selectedDeceased)
        .subscribe({
          next: () => this.handleSuccess(),
          error: (err) => console.error("Error actualizando difunto:", err)
        });
    } else {
      // MODO CREACIÓN: Eliminamos el ID '0'
      const { id, ...newDifunto } = this.selectedDeceased;
      
      // Enviamos el objeto sin ID (newDifunto)
      this.difuntoService.createDifunto(newDifunto as any)
        .subscribe({
          next: () => this.handleSuccess(),
          error: (err) => console.error("Error creando difunto:", err)
        });
    }
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
    if (!fechaNacimiento) return 0;
    const birth = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  get filteredDeceased(): Difunto[] {
    const term = this.searchTerm.toLowerCase();
    return this.deceased.filter(d =>
      (d.nombre && d.nombre.toLowerCase().includes(term)) ||
      (d.apellidos && d.apellidos.toLowerCase().includes(term)) ||
      (d.nombreCementerio && d.nombreCementerio.toLowerCase().includes(term))
    );
  }

  private handleSuccess(): void {
    this.loadDeceased();
    this.deceasedChange.emit();
    this.closeForm();
  }
}