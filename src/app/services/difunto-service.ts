import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Difunto } from '../models/difunto.model';

@Injectable({
  providedIn: 'root'
})
export class DifuntoService {
  private apiUrl = 'http://localhost:8080/api/difuntos';

  constructor(private http: HttpClient) { }

  getDifuntos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createDifunto(difunto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, difunto);
  }

  updateDifunto(id: number, difunto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, difunto);
  }

  deleteDifunto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}