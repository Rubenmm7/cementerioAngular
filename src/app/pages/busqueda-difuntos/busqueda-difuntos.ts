import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusquedaPublicaService } from '../../services/busqueda-publica-service';
import { AyuntamientoService } from '../../services/ayuntamiento-service';
import { CementerioService } from '../../services/cementerio-service';
import { Ayuntamiento } from '../../models/ayuntamiento.model';
import { Cementerio } from '../../models/cementerio.model';
import { Difunto } from '../../models/difunto.model';
import { Navbar } from '../../landing/navbar/navbar';

@Component({
  selector: 'app-busqueda-difuntos',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './busqueda-difuntos.html',
  styleUrls: ['./busqueda-difuntos.css']
})
export class BusquedaDifuntos implements OnInit {

  ayuntamientos: Ayuntamiento[] = [];
  cementerios: Cementerio[] = [];
  cementeriosFiltrados: Cementerio[] = [];
  resultados: Difunto[] = [];

  // Filtros
  selectedAyuntamientoId: number | null = null;
  selectedCementerioId: number | null = null;
  nombreBusqueda: string = '';
  apellidoBusqueda: string = '';

  isLoading = false;
  hasSearched = false;

  // Modal
  difuntoSeleccionado: Difunto | null = null;

  constructor(
    private busquedaService: BusquedaPublicaService,
    private ayuntamientoService: AyuntamientoService,
    private cementerioService: CementerioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.ayuntamientoService.getAyuntamientos().subscribe(data => {
      this.ayuntamientos = data;
      this.cdr.detectChanges();
    });

    this.cementerioService.getCementerios().subscribe(data => {
      this.cementerios = data;
      this.cdr.detectChanges();
    });
  }

  onAyuntamientoChange(newId: number | null) {
    this.selectedAyuntamientoId = newId;
    this.selectedCementerioId = null;
    if (newId) {
      this.cementeriosFiltrados = this.cementerios.filter(
        c => c.ayuntamiento?.id == newId
      );
    } else {
      this.cementeriosFiltrados = [];
    }
    this.cdr.detectChanges();
  }

  buscar() {
    this.isLoading = true;
    this.hasSearched = true;
    this.cdr.detectChanges();

    this.busquedaService.buscarDifuntos(
      this.selectedAyuntamientoId || undefined,
      this.selectedCementerioId || undefined,
      this.nombreBusqueda,
      this.apellidoBusqueda
    ).subscribe({
      next: (res) => {
        this.resultados = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error en búsqueda', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFiltros() {
    this.selectedAyuntamientoId = null;
    this.selectedCementerioId = null;
    this.nombreBusqueda = '';
    this.apellidoBusqueda = '';
    this.cementeriosFiltrados = [];
    this.resultados = [];
    this.hasSearched = false;
    this.difuntoSeleccionado = null;
    this.cdr.detectChanges();
  }

  abrirModal(difunto: Difunto) {
    this.difuntoSeleccionado = difunto;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.difuntoSeleccionado = null;
    document.body.style.overflow = '';
    this.cdr.detectChanges();
  }

  getPhotoUrl(filename: string | undefined): string {
    if (!filename) return 'favicon.svg';
    return `http://localhost:8080/api/difuntos/images/${filename}`;
  }
}