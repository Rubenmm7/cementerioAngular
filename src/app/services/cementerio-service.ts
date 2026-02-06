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
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  getCementerios(): Observable<Cementerio[]> {
    return this.http.get<Cementerio[]>(`${this.apiUrl}/cementerios`);
  }

  getZonasPorCementerio(id: number): Observable<Zona[]> {
    return this.http.get<Zona[]>(`${this.apiUrl}/zonas/cementerio/${id}`);
  }

  getParcelasPorZona(id: number): Observable<Parcela[]> {
    return this.http.get<Parcela[]>(`${this.apiUrl}/parcelas/zona/${id}`);
  }
  
}