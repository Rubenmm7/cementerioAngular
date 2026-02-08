import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    { label: 'Ayuntamientos', value: '' },
    { label: 'Cementerios', value: '' },
    { label: 'Usuarios', value: '' },
    { label: 'Difuntos', value: '' }
  ];

  activities = [
    {
      title: 'Nuevo usuario registrado',
      description: 'Perico Pérez - Administrador Local',
      time: 'Hace 2 horas'
    }
  ];
}
