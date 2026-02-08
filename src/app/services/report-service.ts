import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createReport(report: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, report);
  }

  updateReport(id: number, report: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, report);
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
