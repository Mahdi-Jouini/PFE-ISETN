import { CommonModule } from '@angular/common'; 
import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { DynamicInputComponent } from '../ui/dynamic-input/dynamic-input.component';  
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Sign } from 'crypto';
import { APIService } from '../../services/api.service';
@Injectable({providedIn: 'root'})
@Component({   
  selector: 'app-signup',   
  imports: [     
    CommonModule,      
    FormsModule,      
    DynamicInputComponent,
    HttpClientModule, 
  ],   
  templateUrl: './signup.component.html',   
  styleUrl: './signup.component.css' }) 
  export class SignupComponent {     
    firstName = '';
    lastName = '';
    emailAddress = '';
    password = '';
    confirmPassword = '';

    constructor(private apiService: APIService) {}

    onSubmit() {
  const formData = {
    firstName: this.firstName,
    lastName: this.lastName,
    emailAddress: this.emailAddress,
    password: this.password,
  };

  this.apiService.signupService(formData).subscribe({
    next: (response) => console.log('Signup successful', response),
    error: (error) => console.error('Signup failed', error.error.errors) // Log validation errors
  });
}
    

  } 