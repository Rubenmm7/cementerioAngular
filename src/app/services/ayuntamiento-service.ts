import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ayuntamiento } from '../models/ayuntamiento.model';

@Injectable({
  providedIn: 'root'
})
export class AyuntamientoService {
  private apiUrl = 'http://localhost:8080/api/ayuntamientos';

  constructor(private http: HttpClient) { }

  getAyuntamientos(): Observable<Ayuntamiento[]> {
    return this.http.get<Ayuntamiento[]>(this.apiUrl);
  }

  createAyuntamiento(ayuntamiento: Omit<Ayuntamiento, 'id'>): Observable<Ayuntamiento> {
    return this.http.post<Ayuntamiento>(this.apiUrl, ayuntamiento);
  }

  updateAyuntamiento(id: number, ayuntamiento: Ayuntamiento): Observable<Ayuntamiento> {
    return this.http.put<Ayuntamiento>(`${this.apiUrl}/${id}`, ayuntamiento);
  }

  deleteAyuntamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}