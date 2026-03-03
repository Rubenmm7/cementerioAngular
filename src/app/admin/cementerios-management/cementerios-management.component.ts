import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cementerio } from '../../models/cementerio.model';
import { CementerioService } from '../../services/cementerio-service';
import { Ayuntamiento } from '../../models/ayuntamiento.model';
import { AyuntamientoService } from '../../services/ayuntamiento-service';
import { ZonaService } from '../../services/zona-service';
import { ParcelaService } from '../../services/parcela-service';
import { Zona } from '../../models/zona.model';
import { Parcela, TipoParcela, EstadoParcela } from '../../models/parcela.model';

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
  zonas: Zona[] = [];
  parcelas: Parcela[] = [];
  showForm = false;
  isEditing = false;
  selectedCementerio: any = this.resetSelectedCementerio();
  searchTerm = '';

  // Formulario de parcela (crear y editar)
  showParcelaForm = false;
  isEditingParcela = false;
  editingParcelaId: number | null = null;
  nuevaParcela: any = this.resetParcela();
  selectedZonaId: number | null = null;
  savingParcela = false;

  // Formulario de nueva zona
  showZonaForm = false;
  nuevaZona: any = { nombre: '', numeroFilas: 5, numeroColumnas: 5 };
  savingZona = false;

  readonly tiposParcela: TipoParcela[] = ['NICHO', 'CRIPTA', 'SUELO', 'COLUMBARIO', 'FOSA', 'PANTEON'];
  readonly estadosParcela: EstadoParcela[] = ['LIBRE', 'OCUPADO', 'RESERVADO', 'MANTENIMIENTO'];

  @Output() cementerioChange = new EventEmitter<void>();

  constructor(
    private cementerioService: CementerioService,
    private ayuntamientoService: AyuntamientoService,
    private zonaService: ZonaService,
    private parcelaService: ParcelaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCementerios();
    this.loadAyuntamientos();
  }

  loadCementerios(): void {
    this.cementerioService.getCementerios().subscribe({
      next: (data) => { this.cementerios = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando cementerios:', err)
    });
  }

  loadAyuntamientos(): void {
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (data) => { this.ayuntamientos = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando ayuntamientos:', err)
    });
  }

  loadZonas(cementerioId: number): void {
    this.zonaService.getZonasByCementerio(cementerioId).subscribe({
      next: (data) => { this.zonas = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando zonas:', err)
    });
  }

  loadParcelas(cementerioId: number): void {
    this.parcelaService.getParcelasByCementerio(cementerioId).subscribe({
      next: (data) => { this.parcelas = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando parcelas:', err)
    });
  }

  resetSelectedCementerio() {
    return { id: 0, ayuntamiento: undefined, nombre: '', direccion: '', poblacion: '', provincia: '', codigoPostal: '', emailContacto: '' };
  }

  resetParcela() {
    return { fila: 1, columna: 1, tipo: 'NICHO', estado: 'LIBRE', capacidad: 1 };
  }

  // ── Helpers de visualización ──────────────────────────────────────────────

  /** Convierte PANTEON → Panteón, COLUMBARIO → Columbario, etc. */
  formatEnum(value: string): string {
    if (!value) return '';
    const map: Record<string, string> = {
      NICHO: 'Nicho', CRIPTA: 'Cripta', SUELO: 'Suelo',
      COLUMBARIO: 'Columbario', FOSA: 'Fosa', PANTEON: 'Panteón',
      LIBRE: 'Libre', OCUPADO: 'Ocupado', RESERVADO: 'Reservado',
      MANTENIMIENTO: 'Mantenimiento'
    };
    return map[value] ?? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  openForm(cementerio?: Cementerio): void {
    this.zonas = [];
    this.parcelas = [];
    this.showParcelaForm = false;
    this.showZonaForm = false;
    this.nuevaParcela = this.resetParcela();
    this.selectedZonaId = null;
    this.isEditingParcela = false;
    this.editingParcelaId = null;

    if (cementerio) {
      this.isEditing = true;
      this.selectedCementerio = { ...cementerio, ayuntamiento: cementerio.ayuntamiento ? cementerio.ayuntamiento.id : undefined };
      if (cementerio.id) {
        this.loadZonas(cementerio.id);
        this.loadParcelas(cementerio.id);
      }
    } else {
      this.isEditing = false;
      this.selectedCementerio = this.resetSelectedCementerio();
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.zonas = [];
    this.parcelas = [];
  }

  // ── ZONA ──────────────────────────────────────────────────────────────────

  openZonaForm(): void {
    this.nuevaZona = { nombre: '', numeroFilas: 5, numeroColumnas: 5 };
    this.showZonaForm = true;
  }

  cancelZonaForm(): void { this.showZonaForm = false; }

  saveZona(): void {
    if (!this.selectedCementerio.id) { alert('Guarda el cementerio primero.'); return; }
    this.savingZona = true;
    const payload = { nombre: this.nuevaZona.nombre || 'Zona principal', numeroFilas: this.nuevaZona.numeroFilas, numeroColumnas: this.nuevaZona.numeroColumnas };
    this.zonaService.createZona(payload, this.selectedCementerio.id).subscribe({
      next: () => { this.savingZona = false; this.showZonaForm = false; this.loadZonas(this.selectedCementerio.id); this.cdr.detectChanges(); },
      error: (err) => { console.error('Error creando zona:', err); this.savingZona = false; }
    });
  }

  // ── PARCELA ───────────────────────────────────────────────────────────────

  openParcelaForm(): void {
    this.isEditingParcela = false;
    this.editingParcelaId = null;
    this.nuevaParcela = this.resetParcela();
    this.selectedZonaId = this.zonas.length === 1 ? this.zonas[0].id : null;
    this.showParcelaForm = true;
  }

  openEditParcelaForm(p: Parcela): void {
    this.isEditingParcela = true;
    this.editingParcelaId = p.id;
    this.nuevaParcela = { fila: p.fila, columna: p.columna, tipo: p.tipo, estado: p.estado, capacidad: p.capacidad };
    // Intentar pre-seleccionar la zona desde el campo zona del objeto si lo trae
    this.selectedZonaId = (p as any).zonaId ?? (this.zonas.length === 1 ? this.zonas[0].id : null);
    this.showParcelaForm = true;
  }

  cancelParcelaForm(): void { this.showParcelaForm = false; this.isEditingParcela = false; this.editingParcelaId = null; }

  saveParcela(): void {
    if (!this.selectedZonaId) { alert('Selecciona una zona.'); return; }
    this.savingParcela = true;
    const payload = {
      fila: this.nuevaParcela.fila,
      columna: this.nuevaParcela.columna,
      tipo: this.nuevaParcela.tipo,
      estado: this.nuevaParcela.estado,
      capacidad: this.nuevaParcela.capacidad
    };

    const obs = this.isEditingParcela && this.editingParcelaId
      ? this.parcelaService.updateParcela(this.editingParcelaId, payload, this.selectedZonaId)
      : this.parcelaService.createParcela(payload, this.selectedZonaId);

    obs.subscribe({
      next: () => {
        this.savingParcela = false;
        this.showParcelaForm = false;
        this.isEditingParcela = false;
        this.editingParcelaId = null;
        this.nuevaParcela = this.resetParcela();
        if (this.selectedCementerio.id) this.loadParcelas(this.selectedCementerio.id);
        this.cdr.detectChanges();
      },
      error: (err) => { console.error('Error guardando parcela:', err); this.savingParcela = false; }
    });
  }

  deleteParcela(id: number): void {
    if (!confirm('¿Eliminar esta parcela?')) return;
    this.parcelaService.deleteParcela(id).subscribe({
      next: () => {
        if (this.selectedCementerio.id) this.loadParcelas(this.selectedCementerio.id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error eliminando parcela:', err)
    });
  }

  // ── CEMENTERIO ────────────────────────────────────────────────────────────

  saveCementerio(): void {
    const idAyuntamientoSeleccionado = this.selectedCementerio.ayuntamiento;
    if (!idAyuntamientoSeleccionado) { alert("El ayuntamiento es obligatorio"); return; }
    const payload = { ...this.selectedCementerio, ayuntamientoId: idAyuntamientoSeleccionado, ayuntamiento: null };
    if (this.isEditing) {
      this.cementerioService.updateCementerio(payload.id, payload).subscribe({
        next: () => this.handleSuccess(), error: (e) => console.error(e)
      });
    } else {
      const { id, ...nuevo } = payload;
      this.cementerioService.createCementerio(nuevo).subscribe({
        next: (cem: Cementerio) => {
          if (cem && cem.id) { this.selectedCementerio.id = cem.id; this.isEditing = true; }
          this.loadCementerios(); this.cementerioChange.emit(); this.cdr.detectChanges();
        },
        error: (e) => console.error(e)
      });
    }
  }

  private handleSuccess(): void {
    this.loadCementerios(); this.cementerioChange.emit(); this.closeForm();
  }

  deleteCementerio(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este cementerio?')) {
      this.cementerioService.deleteCementerio(id).subscribe({
        next: () => { this.loadCementerios(); this.cementerioChange.emit(); },
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