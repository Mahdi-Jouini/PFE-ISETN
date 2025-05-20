import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string = '';
  private apiUrl = 'http://localhost:5230/api';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: object) {
    if (isPlatformBrowser(platformId)) {
      this.token = localStorage.getItem('auth_token') || '';
    }
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  signIn(signInFormData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/signIn`, signInFormData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.token = response.token;
          localStorage.setItem('auth_token', this.token);
        }
      })
    );
  }

  signUp(signUpFormData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/signUp`, signUpFormData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.token = response.token;
          localStorage.setItem('auth_token', this.token);
        }
      })
    );
  }

  getCurrentUser(): Observable<any> {
      return this.http.get(`${this.apiUrl}/Auth/me`, {
        headers: this.getHeaders()
      });
  }


  signOut(): void {
    this.token = '';
    localStorage.removeItem('auth_token');
  }
  getToken(): string {
    console.log(this.token)
    return this.token;
  }
}
