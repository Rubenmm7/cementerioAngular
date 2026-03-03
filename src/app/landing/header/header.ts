import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  images: string[] = [
    'carousel/slide1.webp',
    'carousel/slide2.webp',
    'carousel/slide3.webp'
  ];
  currentImageIndex = 0;
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Cambiar la imagen cada 5 segundos
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.cdr.detectChanges(); // Forzar actualización de vista
    }, 5000);
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruye
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
