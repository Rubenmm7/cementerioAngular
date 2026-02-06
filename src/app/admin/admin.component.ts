import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth';
import { Cementerio } from '../models/cementerio.model';
import { Ayuntamiento } from '../models/ayuntamiento.model';
import { Router } from '@angular/router';
import { CementerioService } from '../services/cementerio-service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // Estado de la interfaz
  sidebarOpen = false;
  activeTab = 'dashboard'; // Pestaña inicial
  currentUser = 'Admin';   // Nombre del usuario logueado

  // Datos del Backend
  cementerios: Cementerio[] = [];
  ayuntamientos: Ayuntamiento[] = [];
  
  // Estadísticas
  stats = {
    totalAyuntamientos: 0,
    totalCementerios: 0,
    usuariosActivos: 3, // Dato simulado
    difuntosRegistrados: 150 // Dato simulado
  };

  constructor(
    private cementerioService: CementerioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    // Recuperar nombre del usuario si está en el token/localStorage
    const tokenUser = localStorage.getItem('username'); // Opcional si lo guardaste
    if (tokenUser) this.currentUser = tokenUser;
  }

  cargarDatos(): void {
    // 1. Cargar Cementerios desde Spring Boot
    this.cementerioService.getCementerios().subscribe({
      next: (data) => {
        this.cementerios = data;
        this.stats.totalCementerios = data.length;

        // 2. Extraer Ayuntamientos únicos de los cementerios
        const mapaAytos = new Map();
        data.forEach(c => {
          if (c.ayuntamiento) mapaAytos.set(c.ayuntamiento.id, c.ayuntamiento);
        });
        this.ayuntamientos = Array.from(mapaAytos.values());
        this.stats.totalAyuntamientos = this.ayuntamientos.length;
      },
      error: (err) => console.error('Error conectando con el backend:', err)
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cambiarPestana(tab: string): void {
    this.activeTab = tab;
    // En móviles, cerrar sidebar al elegir opción
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- CRUD (Ejemplos) ---

  borrarCementerio(id: number): void {
    if(confirm('¿Seguro que deseas eliminar este cementerio?')) {
      // Simulación visual (aquí iría la llamada real al backend)
      this.cementerios = this.cementerios.filter(c => c.id !== id);
      this.stats.totalCementerios--;
    }
  }
}