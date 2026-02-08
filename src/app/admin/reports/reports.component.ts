import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report-service';



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

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getReports().subscribe({
      next: (data: any[]) => this.reports = data,
      error: (err) => console.error('Error cargando reportes:', err)
    });
  }

  openReport(report: Report): void {
    this.selectedReport = report;
    if (report.estado === 'no_leido') {
      this.markAsRead(report.id);
    }
  }

  closeReport(): void {
    this.selectedReport = null;
  }

  deleteReport(id?: number): void {
    if (id && confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          this.reports = this.reports.filter(r => r.id !== id);
          this.closeReport();
        },
        error: (err) => console.error('Error eliminando reporte:', err)
      });
    }
  }

  markAsUnread(id?: number): void {
    const report = this.reports.find(r => r.id === id);
    if (report) {
      report.estado = 'no_leido';
      this.reportService.updateReport(id!, report).subscribe({
        error: (err) => console.error('Error actualizando reporte:', err)
      });
    }
  }

  markAsRead(id?: number): void {
    const report = this.reports.find(r => r.id === id);
    if (report) {
      report.estado = 'leido';
      this.reportService.updateReport(id!, report).subscribe({
        error: (err) => console.error('Error actualizando reporte:', err)
      });
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
