import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { JwtResponse } from '../models/jwt-response';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveRoles(roles: string[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveSession(res: JwtResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('roles', JSON.stringify(res.roles));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    try {
      const stored = localStorage.getItem('roles');
      if (!stored) return false;
      let parsed = JSON.parse(stored);

      // Si por algún motivo el parseo devuelve un string que parece un array, parsearlo otra vez
      if (typeof parsed === 'string' && parsed.startsWith('[')) {
        parsed = JSON.parse(parsed);
      }

      const roles: string[] = Array.isArray(parsed) ? parsed : [parsed];

      return roles.some(r => {
        if (!r) return false;
        const clean = r.toString().trim().toUpperCase();
        const search = role.toString().trim().toUpperCase();
        return clean === search || clean === `ROLE_${search}`;
      });
    } catch (e) {
      console.error('Error parsing roles from localStorage', e);
      return false;
    }
  }

  getUserRole(): string {
    try {
      const stored = localStorage.getItem('roles');
      if (!stored) return '';
      let parsed = JSON.parse(stored);

      if (typeof parsed === 'string' && parsed.startsWith('[')) {
        parsed = JSON.parse(parsed);
      }

      const roles: string[] = Array.isArray(parsed) ? parsed : [parsed];
      if (roles.length > 0 && roles[0]) {
        return roles[0].toString().trim().replace(/^ROLE_/i, '');
      }
    } catch (e) {
      return '';
    }
    return '';
  }

  logout(): void {
    localStorage.clear();
  }
}
