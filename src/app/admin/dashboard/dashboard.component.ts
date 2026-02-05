import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    { label: 'Total Usuarios', value: '1.245' },
    { label: 'Cementerios', value: '48' },
    { label: 'Registros', value: '52.340' },
    { label: 'Ingresos', value: '127.500 €' }
  ];

  activities = [
    {
      title: 'Nuevo usuario registrado',
      description: 'Perico Pérez - Administrador Local',
      time: 'Hace 2 horas'
    },
    {
      title: 'Configuración actualizada',
      description: 'Parámetros de seguridad modificados',
      time: 'Hace 5 horas'
    },
    {
      title: 'Reporte generado',
      description: 'Reporte mensual de ingresos completado',
      time: 'Hace 1 día'
    }
  ];
}
