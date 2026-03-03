import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zona } from '../models/zona.model';

@Injectable({ providedIn: 'root' })
export class ZonaService {
    private apiUrl = 'http://localhost:8080/api/zonas';

    constructor(private http: HttpClient) { }

    getZonasByCementerio(cementerioId: number): Observable<Zona[]> {
        return this.http.get<Zona[]>(`${this.apiUrl}/cementerio/${cementerioId}`);
    }

    createZona(zona: any, cementerioId: number): Observable<Zona> {
        return this.http.post<Zona>(`${this.apiUrl}?cementerioId=${cementerioId}`, zona);
    }
}
