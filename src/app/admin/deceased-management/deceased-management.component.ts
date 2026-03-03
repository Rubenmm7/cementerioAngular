import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DifuntoService } from '../../services/difunto-service';
import { CementerioService } from '../../services/cementerio-service';
import { ParcelaService } from '../../services/parcela-service';
import { Difunto } from '../../models/difunto.model';
import { Cementerio } from '../../models/cementerio.model';
import { Parcela } from '../../models/parcela.model';

@Component({
  selector: 'app-deceased-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deceased-management.component.html',
  styleUrls: ['../management-styles.css']
})
export class DeceasedManagementComponent implements OnInit {

  deceased: Difunto[] = [];
  cementerios: Cementerio[] = [];
  parcelas: Parcela[] = [];
  showForm = false;
  isEditing = false;
  searchTerm = '';

  selectedCementerioId: number | null = null;
  selectedParcelaId: number | null = null;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @Output() deceasedChange = new EventEmitter<void>();

  selectedDeceased: Difunto = this.resetDeceased();

  constructor(
    private difuntoService: DifuntoService,
    private cementerioService: CementerioService,
    private parcelaService: ParcelaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDeceased();
    this.loadCementerios();
  }

  resetDeceased(): Difunto {
    return {
      id: 0,
      nombre: '',
      apellidos: '',
      dni: '',
      fechaNacimiento: null as any,
      fechaDefuncion: null as any,
      fechaEnterramiento: null as any,
      biografia: '',
      parcelaId: undefined,
      nombreCementerio: '',
      fotoUrl: ''
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

  loadCementerios(): void {
    this.cementerioService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando cementerios', e)
    });
  }

  openForm(item?: Difunto): void {
    this.selectedFile = null;
    this.imagePreview = null;

    if (item) {
      this.isEditing = true;
      this.selectedDeceased = { ...item };

      // Mostrar la URL del backend temporalmente en la vista previa de la foto
      if (item.fotoUrl) {
        this.imagePreview = `http://localhost:8080/api/difuntos/images/${item.fotoUrl}`;
      }

      // Pre-seleccionar cementerio
      const cem = this.cementerios.find(c => c.nombre === item.nombreCementerio);
      this.selectedCementerioId = cem ? cem.id! : null;
      this.selectedParcelaId = item.parcelaId ?? null;
      // Cargar parcelas del cementerio si lo tiene
      if (this.selectedCementerioId) {
        this.loadParcelasByCementerio(this.selectedCementerioId);
      }
    } else {
      this.isEditing = false;
      this.selectedDeceased = this.resetDeceased();
      this.selectedCementerioId = null;
      this.selectedParcelaId = null;
      this.parcelas = [];
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedCementerioId = null;
    this.selectedParcelaId = null;
    this.parcelas = [];
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onCementerioChange(cemId: number | null): void {
    this.selectedCementerioId = cemId;
    this.selectedParcelaId = null;
    this.parcelas = [];

    const cem = this.cementerios.find(c => c.id == cemId);
    this.selectedDeceased.nombreCementerio = cem ? cem.nombre : '';

    if (cemId) {
      this.loadParcelasByCementerio(cemId);
    }
    this.cdr.detectChanges();
  }

  loadParcelasByCementerio(cemId: number): void {
    this.parcelaService.getParcelasByCementerio(cemId).subscribe({
      next: (data) => {
        this.parcelas = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando parcelas', e)
    });
  }

  parcelaLabel(p: Parcela): string {
    return `#${p.id} — Fila ${p.fila}, Col ${p.columna} [${p.tipo}] (${p.estado})`;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validación de tipo de archivo
      if (!file.type.match(/image\/(jpeg|png|webp)/)) {
        alert('Solo se permiten imágenes en formato JPEG, PNG o WEBP.');
        event.target.value = ''; // Resetear input
        return;
      }

      // Validación de tamaño (Máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es de 2MB.');
        event.target.value = ''; // Resetear input
        return;
      }

      this.selectedFile = file;

      // Crear previsualización
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imagePreview = e.target.result;
          this.cdr.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedDeceased.fotoUrl = ''; // Limpiar referencia si existia

    // Limpiar el valor del input file si persiste en DOM
    const fileInput = document.getElementById('fotoInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.cdr.detectChanges();
  }

  saveDeceased(): void {
    if (!this.selectedDeceased.nombre || !this.selectedDeceased.apellidos) {
      alert("Nombre y Apellidos son obligatorios");
      return;
    }

    const payload = {
      nombre: this.selectedDeceased.nombre,
      apellidos: this.selectedDeceased.apellidos,
      dni: this.selectedDeceased.dni || null,
      fechaNacimiento: this.selectedDeceased.fechaNacimiento || null,
      fechaDefuncion: this.selectedDeceased.fechaDefuncion || null,
      fechaEnterramiento: this.selectedDeceased.fechaEnterramiento || null,
      biografia: this.selectedDeceased.biografia || null,
      parcelaId: this.selectedParcelaId || null,
      fotoUrl: this.selectedDeceased.fotoUrl || null
    };

    // Crear FormData
    const formData = new FormData();
    formData.append('difunto', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.isEditing && this.selectedDeceased.id) {
      this.difuntoService.updateDifunto(this.selectedDeceased.id, formData)
        .subscribe({
          next: () => this.handleSuccess(),
          error: (err) => console.error("Error actualizando difunto:", err)
        });
    } else {
      this.difuntoService.createDifunto(formData)
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

  getPhotoUrl(filename: string | undefined): string {
    if (!filename) return 'favicon.svg'; // Default avatar based on existing public asset
    return `http://localhost:8080/api/difuntos/images/${filename}`;
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