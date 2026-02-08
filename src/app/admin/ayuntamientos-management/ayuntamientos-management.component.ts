import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ayuntamiento } from '../../models/ayuntamiento.model';
import { AyuntamientoService } from '../../services/ayuntamiento-service';

@Component({
  selector: 'app-ayuntamientos-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ayuntamientos-management.component.html',
  styleUrls: ['../management-styles.css']
})

export class AyuntamientosManagementComponent implements OnInit {
  ayuntamientos: Ayuntamiento[] = [];
  showForm = false;
  isEditing = false;
  selectedAyuntamiento: Ayuntamiento = this.resetSelectedAyuntamiento();
  searchTerm = '';

  @Output() ayuntamientoChange = new EventEmitter<void>();

  constructor(
    private ayuntamientoService: AyuntamientoService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.loadAyuntamientos();
  }

  loadAyuntamientos(): void {
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (data) => {
        this.ayuntamientos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando ayuntamientos:', err)
    });
  }

  resetSelectedAyuntamiento(): Ayuntamiento {
    return { id: 0, nombre: '', direccion: '', telefono: '', email: '' };
  }

  openForm(ayuntamiento?: Ayuntamiento): void {
    if (ayuntamiento) {
      this.isEditing = true;
      this.selectedAyuntamiento = { ...ayuntamiento };
    } else {
      this.isEditing = false;
      this.selectedAyuntamiento = this.resetSelectedAyuntamiento();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveAyuntamiento(): void {
    const operation = this.isEditing
      ? this.ayuntamientoService.updateAyuntamiento(this.selectedAyuntamiento.id, this.selectedAyuntamiento)
      : this.ayuntamientoService.createAyuntamiento(this.selectedAyuntamiento);

    operation.subscribe({
      next: () => {
        this.loadAyuntamientos();
        this.ayuntamientoChange.emit();
        this.closeForm();
      },
      error: (err) => console.error("Error guardando ayuntamiento:", err)
    });
  }

  deleteAyuntamiento(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este ayuntamiento?')) {
      this.ayuntamientoService.deleteAyuntamiento(id).subscribe({
        next: () => {
          this.loadAyuntamientos();
          this.ayuntamientoChange.emit();
        },
        error: (err) => console.error("Error eliminando ayuntamiento:", err)
      });
    }
  }

  get filteredAyuntamientos(): Ayuntamiento[] {
    const searchTerm = this.searchTerm.toLowerCase();
    return this.ayuntamientos.filter(a =>
      (a.nombre && a.nombre.toLowerCase().includes(searchTerm)) ||
      (a.email && a.email.toLowerCase().includes(searchTerm))
    );
  }
}