import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Difunto } from '../models/difunto.model';

@Injectable({
  providedIn: 'root'
})
export class BusquedaPublicaService {

  // Ajusta esta URL si tu endpoint en BusquedaPublicaController es diferente
  private apiUrl = 'http://localhost:8080/api/public'; 

  constructor(private http: HttpClient) { }

  buscarDifuntos(ayuntamientoId?: number, cementerioId?: number, nombre?: string, apellido?: string): Observable<Difunto[]> {
    let params = new HttpParams();

    if (ayuntamientoId) params = params.set('ayuntamientoId', ayuntamientoId);
    if (cementerioId) params = params.set('cementerioId', cementerioId);
    if (nombre) params = params.set('nombre', nombre);
    if (apellido) params = params.set('apellido', apellido);

    // Asumimos que el endpoint es /buscar o /difuntos dentro de api/public
    return this.http.get<Difunto[]>(`${this.apiUrl}/buscar`, { params });
  }
}