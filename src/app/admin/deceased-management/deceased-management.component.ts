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
    if (item) {
      this.isEditing = true;
      this.selectedDeceased = { ...item };
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

  saveDeceased(): void {
    if (!this.selectedDeceased.nombre || !this.selectedDeceased.apellidos) {
      alert("Nombre y Apellidos son obligatorios");
      return;
    }

    const toPayload = (d: Difunto) => ({
      nombre: d.nombre,
      apellidos: d.apellidos,
      dni: d.dni || null,
      fechaNacimiento: d.fechaNacimiento || null,
      fechaDefuncion: d.fechaDefuncion || null,
      fechaEnterramiento: d.fechaEnterramiento || null,
      biografia: d.biografia || null,
      parcelaId: this.selectedParcelaId || null
    });

    if (this.isEditing && this.selectedDeceased.id) {
      this.difuntoService.updateDifunto(this.selectedDeceased.id, toPayload(this.selectedDeceased) as any)
        .subscribe({
          next: () => this.handleSuccess(),
          error: (err) => console.error("Error actualizando difunto:", err)
        });
    } else {
      this.difuntoService.createDifunto(toPayload(this.selectedDeceased) as any)
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