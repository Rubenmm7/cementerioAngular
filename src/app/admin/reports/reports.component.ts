import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Report {
  id?: number;
  fecha: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  telefono: string;
  estado: 'no_leido' | 'leido';
  tipo: 'consulta' | 'sugerencia' | 'queja' | 'otro';
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  selectedReport: Report | null = null;
  filterStatus = 'todos'; // todos, no_leido, leido
  searchTerm = '';

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    // Datos de ejemplo - conectaremos con API más tarde
    this.reports = [
      {
        id: 1,
        fecha: '2024-02-04',
        nombre: 'Juan García',
        email: 'juan@example.com',
        asunto: 'Consulta sobre servicios',
        mensaje: 'Me gustaría conocer más sobre los servicios disponibles para futuros servicios.',
        telefono: '600123456',
        estado: 'no_leido',
        tipo: 'consulta'
      },
      {
        id: 2,
        fecha: '2024-02-03',
        nombre: 'María López',
        email: 'maria@example.com',
        asunto: 'Sugerencia de mejora',
        mensaje: 'Sería genial si pudieran implementar un sistema de reserva de parcelas en línea.',
        telefono: '600234567',
        estado: 'leido',
        tipo: 'sugerencia'
      },
      {
        id: 3,
        fecha: '2024-02-02',
        nombre: 'Carlos Martínez',
        email: 'carlos@example.com',
        asunto: 'Problema con trámite',
        mensaje: 'He tenido dificultades para completar mi solicitud. Necesito ayuda.',
        telefono: '600345678',
        estado: 'no_leido',
        tipo: 'queja'
      }
    ];
  }

  openReport(report: Report): void {
    this.selectedReport = report;
    if (report.estado === 'no_leido') {
      report.estado = 'leido';
    }
  }

  closeReport(): void {
    this.selectedReport = null;
  }

  deleteReport(id?: number): void {
    if (id && confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      this.reports = this.reports.filter(r => r.id !== id);
      this.closeReport();
    }
  }

  markAsUnread(id?: number): void {
    const report = this.reports.find(r => r.id === id);
    if (report) {
      report.estado = 'no_leido';
    }
  }

  markAsRead(id?: number): void {
    const report = this.reports.find(r => r.id === id);
    if (report) {
      report.estado = 'leido';
    }
  }

  getUnreadCount(): number {
    return this.reports.filter(r => r.estado === 'no_leido').length;
  }

  getTypeLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'consulta': 'Consulta',
      'sugerencia': 'Sugerencia',
      'queja': 'Queja',
      'otro': 'Otro'
    };
    return labels[tipo] || tipo;
  }

  get filteredReports(): Report[] {
    return this.reports.filter(r => {
      const matchesStatus = this.filterStatus === 'todos' || r.estado === this.filterStatus;
      const matchesSearch = this.searchTerm === '' || 
        r.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.asunto.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }
}
