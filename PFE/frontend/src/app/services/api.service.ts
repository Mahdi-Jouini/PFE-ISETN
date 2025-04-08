import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private apiUrl = 'http://localhost:5230/api';
  private token: string = '';
  private isBrowser: boolean;
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.token = localStorage.getItem('auth_token') || '';
    }
  }
  
  AUTH(root: string, user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${root}`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.token = response.token;
          if (this.isBrowser) {
            localStorage.setItem('auth_token', this.token);
          }
        }
      })
    );
  }
  
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.token) {
      headers = headers.append('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }
  
  POST(root: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${root}`, data, {
      headers: this.getHeaders()
    });
  }
  
  GET(root: string, id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${root}${id}`, {
      headers: this.getHeaders()
    });
  }
  
  PUT(root: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${root}/${id}`, data, {
      headers: this.getHeaders()
    });
  }
  
  DELETE(root: string, id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${root}/${id}`, {
      headers: this.getHeaders()
    });
  }

  FILE(root: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    let headers = new HttpHeaders();
    if (this.token) {
      headers = headers.append('Authorization', `Bearer ${this.token}`);
    }
  
    return this.http.post(`${this.apiUrl}${root}`, formData, {
      headers: headers
    });
  }
  
  GET_FILE(fileName: string): string {
    const fileURL = `${this.apiUrl}/File/${fileName}`
    return (fileURL);
  }
  
  
  setToken(token: string): void {
    this.token = token;
    if (this.isBrowser) {
      localStorage.setItem('auth_token', token);
    }
  }
  
  isAuthenticated(): boolean {
    return !!this.token;
  }
  
  logout(): void {
    this.token = '';
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
    }
  }
}