import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicInputComponent } from '../ui/dynamic-input/dynamic-input.component';
import { HttpClientModule } from '@angular/common/http';
import { APIService } from '../../services/api.service';
import { OtpComponent } from "../ui/otp/otp.component";

@Component({
  selector: 'app-signin',
  imports: [
    CommonModule,
    FormsModule,
    DynamicInputComponent,
    HttpClientModule,
],  
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  emailAddress = '';
  password = '';
  constructor(private apiService: APIService) {}

  
  
  onSubmit() {
    const formData = {
      Email: this.emailAddress,
      Password: this.password,
    };
    this.apiService.AUTH("/Auth/signIn", formData).subscribe({
      next: (response) => console.log('Sign in successful', response),
      error: (error) => console.error('Sign in failed', error.error.errors)
    })
  }

}
