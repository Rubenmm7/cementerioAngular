import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusquedaPublicaService } from '../../services/busqueda-publica-service';
import { AyuntamientoService } from '../../services/ayuntamiento-service';
import { CementerioService } from '../../services/cementerio-service';
import { Ayuntamiento } from '../../models/ayuntamiento.model';
import { Cementerio } from '../../models/cementerio.model';
import { Difunto } from '../../models/difunto.model';
import { Navbar } from '../../landing/navbar/navbar'; // Asegúrate de importar tu Navbar existente

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

  constructor(
    private busquedaService: BusquedaPublicaService,
    private ayuntamientoService: AyuntamientoService,
    private cementerioService: CementerioService
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    // Cargamos ayuntamientos para el desplegable
    this.ayuntamientoService.getAyuntamientos().subscribe(data => {
      this.ayuntamientos = data;
    });

    // Cargamos todos los cementerios (luego los filtraremos en memoria para ir rápido)
    this.cementerioService.getCementerios().subscribe(data => {
      this.cementerios = data;
    });
  }

  onAyuntamientoChange() {
    this.selectedCementerioId = null; // Reset cementerio
    if (this.selectedAyuntamientoId) {
      // Filtramos los cementerios que pertenecen al ayuntamiento seleccionado
      // NOTA: Asumo que tu modelo Cementerio tiene una propiedad 'ayuntamiento' o 'ayuntamientoId'
      this.cementeriosFiltrados = this.cementerios.filter(c => c.ayuntamiento?.id == this.selectedAyuntamientoId);
    } else {
      this.cementeriosFiltrados = [];
    }
  }

  buscar() {
    this.isLoading = true;
    this.hasSearched = true;
    
    // Si el backend espera 'undefined' en lugar de null, hacemos una pequeña conversión,
    // pero generalmente HttpClient maneja nulls ignorándolos o enviándolos vacíos.
    // Aquí pasamos los valores tal cual.
    this.busquedaService.buscarDifuntos(
      this.selectedAyuntamientoId || undefined, 
      this.selectedCementerioId || undefined, 
      this.nombreBusqueda, 
      this.apellidoBusqueda
    ).subscribe({
      next: (res) => {
        this.resultados = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en búsqueda', err);
        this.isLoading = false;
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
  }
}