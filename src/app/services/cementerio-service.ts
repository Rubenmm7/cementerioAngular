import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cementerio } from '../models/cementerio.model';
import { Zona } from '../models/zona.model';
import { Parcela } from '../models/parcela.model';

@Injectable({
  providedIn: 'root'
})
export class CementerioService {
  private apiUrl = 'http://localhost:8080/api/cementerios';

  constructor(private http: HttpClient) { }

  // Obtener todos
  getCementerios(): Observable<Cementerio[]> {
    return this.http.get<Cementerio[]>(this.apiUrl);
  }

  // Crear uno nuevo
  createCementerio(cementerio: Cementerio): Observable<Cementerio> {
    return this.http.post<Cementerio>(this.apiUrl, cementerio);
  }

  // Actualizar existente
  updateCementerio(id: number, cementerio: Cementerio): Observable<Cementerio> {
    return this.http.put<Cementerio>(`${this.apiUrl}/${id}`, cementerio);
  }

  // Eliminar
  deleteCementerio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getZonasPorCementerio(id: number): Observable<Zona[]> {
    return this.http.get<Zona[]>(`http://localhost:8080/api/zonas/cementerio/${id}`);
  }

  getParcelasPorZona(id: number): Observable<Parcela[]> {
    return this.http.get<Parcela[]>(`http://localhost:8080/api/parcelas/zona/${id}`);
  }
}