import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcela } from '../models/parcela.model';

@Injectable({ providedIn: 'root' })
export class ParcelaService {
    private apiUrl = 'http://localhost:8080/api/parcelas';

    constructor(private http: HttpClient) { }

    getParcelasByCementerio(cementerioId: number): Observable<Parcela[]> {
        return this.http.get<Parcela[]>(`${this.apiUrl}/cementerio/${cementerioId}`);
    }

    getParcelasByZona(zonaId: number): Observable<Parcela[]> {
        return this.http.get<Parcela[]>(`${this.apiUrl}/zona/${zonaId}`);
    }

    createParcela(parcela: any, zonaId: number): Observable<Parcela> {
        return this.http.post<Parcela>(`${this.apiUrl}?zonaId=${zonaId}`, parcela);
    }

    updateParcela(id: number, parcela: any, zonaId: number): Observable<Parcela> {
        return this.http.put<Parcela>(`${this.apiUrl}/${id}?zonaId=${zonaId}`, parcela);
    }

    deleteParcela(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
