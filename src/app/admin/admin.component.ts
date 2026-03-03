import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth';
import { Router, RouterLink } from '@angular/router';
import { CementerioService } from '../services/cementerio-service';
import { UserService } from '../services/user-service';
import { DifuntoService } from '../services/difunto-service';
import { AyuntamientoService } from '../services/ayuntamiento-service';
import { UsersManagementComponent } from './users-management/users-management.component';
import { AyuntamientosManagementComponent } from './ayuntamientos-management/ayuntamientos-management.component';
import { CementeriosManagementComponent } from "./cementerios-management/cementerios-management.component";
import { DeceasedManagementComponent } from './deceased-management/deceased-management.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    UsersManagementComponent,
    AyuntamientosManagementComponent,
    CementeriosManagementComponent,
    DeceasedManagementComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  sidebarOpen = false;
  activeTab = 'dashboard';
  currentUser = 'Admin';
  stats = {
    totalAyuntamientos: 0,
    totalCementerios: 0,
    totalUsuarios: 0,
    difuntosRegistrados: 0
  };

  constructor(
    private cementerioService: CementerioService,
    private userService: UserService,
    private difuntoService: DifuntoService,
    private ayuntamientoService: AyuntamientoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
    // Recuperar nombre del usuario si está en el token/localStorage
    const tokenUser = localStorage.getItem('username');
    if (tokenUser) this.currentUser = tokenUser;
  }

  cargarDatos(): void {
    const isSuper = this.isSuperAdmin();
    const requests: any = {
      cementerios: this.cementerioService.getCementerios(),
      difuntos: this.difuntoService.getDifuntos()
    };

    if (isSuper) {
      requests.ayuntamientos = this.ayuntamientoService.getAyuntamientos();
      requests.usuarios = this.userService.getUsers();
    }

    forkJoin(requests).subscribe({
      next: (results: any) => {
        this.stats.totalCementerios = results.cementerios.length;
        this.stats.difuntosRegistrados = results.difuntos.length;
        if (isSuper) {
          this.stats.totalAyuntamientos = results.ayuntamientos.length;
          this.stats.totalUsuarios = results.usuarios.length;
        }
        this.cdr.detectChanges(); // Forzar la actualización de la vista
      },
      error: (err) => console.error('Error cargando las estadísticas del dashboard:', err)
    });
  }

  isSuperAdmin(): boolean {
    return this.authService.hasRole('SUPERADMIN');
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cambiarPestana(tab: string): void {
    this.activeTab = tab;
    // Si se hace clic en el dashboard, recargar los datos frescos
    if (tab === 'dashboard') {
      this.cargarDatos();
    }
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}