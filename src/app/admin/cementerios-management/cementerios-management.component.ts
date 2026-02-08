import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cementerio } from '../../models/cementerio.model';
import { CementerioService } from '../../services/cementerio-service';
import { Ayuntamiento } from '../../models/ayuntamiento.model';
import { AyuntamientoService } from '../../services/ayuntamiento-service';

@Component({
  selector: 'app-cementerios-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cementerios-management.component.html',
  styleUrls: ['./../management-styles.css']
})
export class CementeriosManagementComponent implements OnInit {
  cementerios: Cementerio[] = [];
  ayuntamientos: Ayuntamiento[] = [];
  showForm = false;
  isEditing = false;
  selectedCementerio: any = this.resetSelectedCementerio();
  searchTerm = '';

  @Output() cementerioChange = new EventEmitter<void>();

  constructor(
    private cementerioService: CementerioService,
    private ayuntamientoService: AyuntamientoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCementerios();
    this.loadAyuntamientos();
  }

  loadCementerios(): void {
    this.cementerioService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando cementerios:', err)
    });
  }

  loadAyuntamientos(): void {
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (data) => {
        this.ayuntamientos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando ayuntamientos para el formulario:', err)
    });
  }

  resetSelectedCementerio() {
    return {
    id: 0,
    ayuntamiento: undefined,
    nombre: '',
    direccion: '',
    poblacion: ''
};
  }

  openForm(cementerio?: Cementerio): void {
    if (cementerio) {
      this.isEditing = true;
      this.selectedCementerio = { ...cementerio, ayuntamiento: cementerio.ayuntamiento ? cementerio.ayuntamiento.id : undefined };
    } else {
      this.isEditing = false;
      this.selectedCementerio = this.resetSelectedCementerio();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  saveCementerio(): void {
    const payload = { ...this.selectedCementerio, ayuntamiento: { id: this.selectedCementerio.ayuntamiento } };

    const operation = this.isEditing
      ? this.cementerioService.updateCementerio(payload.id, payload)
      : this.cementerioService.createCementerio(payload);

    operation.subscribe({
      next: () => {
        this.loadCementerios();
        this.cementerioChange.emit();
        this.closeForm();
      },
      error: (err) => console.error("Error guardando cementerio:", err)
    });
  }

  deleteCementerio(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este cementerio?')) {
      this.cementerioService.deleteCementerio(id).subscribe({
        next: () => {
          this.loadCementerios();
          this.cementerioChange.emit();
        },
        error: (err) => console.error("Error eliminando cementerio:", err)
      });
    }
  }

  get filteredCementerios(): Cementerio[] {
    const searchTerm = this.searchTerm.toLowerCase();
    return this.cementerios.filter(c =>
      (c.nombre && c.nombre.toLowerCase().includes(searchTerm)) ||
      (c.poblacion && c.poblacion.toLowerCase().includes(searchTerm))
    );
  }
}