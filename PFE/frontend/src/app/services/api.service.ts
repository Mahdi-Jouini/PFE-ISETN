import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
  GET_All(root: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${root}`, {
      headers: this.getHeaders()
    });
  }
  
  PUT(root: string, data?: any): Observable<any> {

    return this.http.put(`${this.apiUrl}${root}`, data, {
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

  uploadFile(endpoint: string, formData: FormData): Observable<any> {
    let headers = new HttpHeaders();
    if (this.token) {
      headers = headers.append('Authorization', `Bearer ${this.token}`);
    }
  
    return this.http.post(`${this.apiUrl}/${endpoint}`, formData, {
      headers: headers
    })
  }

  uploadAndAttachFiles(files: File[], meta: { projectId?: string, sprintId?: string, ticketId?: string }): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
  
    let headers = new HttpHeaders();
    if (this.token) {
      headers = headers.append('Authorization', `Bearer ${this.token}`);
    }
  
    return this.http.post<any[]>(`${this.apiUrl}/File/UploadMultipleFiles`, formData, { headers }).pipe(
      switchMap((uploadedFiles: any[]) => {
        const attachments = uploadedFiles.map(file => ({
          originalName: file.originalName,
          size: file.size,
          url: file.url,
          type: file.type,
          projectId: meta.projectId?.trim() || null,
          sprintId: meta.sprintId?.trim() || null,
          ticketId: meta.ticketId?.trim() || null,


        }));
        console.log(attachments)
  
        return this.http.post<any>(`${this.apiUrl}/File/AddFilesAttachment`, attachments, { headers });
      })
    );
  }
  
  
  
  
  
  GET_FILE(fileName?: string): string {
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