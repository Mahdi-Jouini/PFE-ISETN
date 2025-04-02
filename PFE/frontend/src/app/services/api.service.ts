import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private apiUrl = 'http://localhost:5230/api';

  constructor(private http: HttpClient) { }

  signupService(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Utilisateur/PostUtilisateur`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  signinService( emailAddress: string, password: string ): Observable<any> {
    return this.http.get(`${this.apiUrl}/Utilisateur/signIn?EmailAddress=${emailAddress}&password=${password}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
