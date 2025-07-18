import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
        })
      );
  }

  logout() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')!,
    });

    return this.http.post<any>(`${this.API_URL}/logout`, {}, { headers });
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getUser() {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded ? decoded : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'ADMIN';
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const decoded = this.decodeToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  refresh(refreshToken: string) {
    if (refreshToken) {
      return this.http.post<{ accessToken: string; refreshToken: string }>(
        `${this.API_URL}/refresh`,
        { refreshToken }
      );
    } else {
      return of(null);
    }
  }
}
