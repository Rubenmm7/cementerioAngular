import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CementerioService } from '../services/cementerio-service';
import { AuthService } from '../auth/auth';
import {Cementerio } from '../models/cementerio.model';
import { Ayuntamiento } from '../models/ayuntamiento.model';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html', // Tu HTML original
  styleUrl: './admin.component.css'      // Tu CSS original
})
export class AdminComponent implements OnInit {

  // Variables para tus datos
  ayuntamientos: Ayuntamiento[] = [];
  cementerios: Cementerio[] = [];
  seccionActiva: string = 'dashboard'; // Valores: 'dashboard', 'ayuntamientos', 'cementerios', 'usuarios'

  constructor(
    private cementerioService: CementerioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar Cementerios desde el backend
    this.cementerioService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        
        // Extraer Ayuntamientos únicos de los cementerios (truco para no hacer otra petición)
        const map = new Map();
        data.forEach(c => {
          if(c.ayuntamiento) map.set(c.ayuntamiento.id, c.ayuntamiento);
        });
        this.ayuntamientos = Array.from(map.values());
      },
      error: (e) => console.error('Error al cargar datos:', e)
    });
  }

  // Método para cambiar de sección (conectar a tus botones del menú)
  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}