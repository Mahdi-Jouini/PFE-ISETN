import { CommonModule } from '@angular/common'; 
import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { DynamicInputComponent } from '../ui/dynamic-input/dynamic-input.component';  
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Sign } from 'crypto';
import { APIService } from '../../services/api.service';
import { OtpComponent } from "../ui/otp/otp.component";
import { log } from 'console';
@Injectable({providedIn: 'root'})
@Component({   
  selector: 'app-signup',   
  imports: [
    CommonModule,
    FormsModule,
    DynamicInputComponent,
    HttpClientModule,
    OtpComponent
],   
  templateUrl: './signup.component.html',   
  styleUrl: './signup.component.css' }) 
  export class SignupComponent {     
    firstName = '';
    lastName = '';
    emailAddress = "";
    profileImage: File | null = null;
    fileName = "";
    password = '';
    confirmPassword = '';
    otpValue= '';
    currentStep: number = 0;


    constructor(private apiService: APIService) {}

// In signup.component.ts
onFileChange(file: any) {
  if (file instanceof File) {
    this.profileImage = file;
  }
}

uploadFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!this.profileImage) {
      console.log('No file selected');
      resolve("");
      return;
    }

    this.apiService.FILE('/File', this.profileImage).subscribe({
      next: (response) => {
        console.log(response);
        this.fileName = response.fileName;
        resolve(response.fileName);
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        reject(error);
      }
    });
  });
}

  async nextStep() {
    this.apiService.GET(`/Auth/sendOtp?emailAddress=${this.emailAddress}`,"").subscribe({
      next: (response) => {
        console.log(response);
        if (this.validateFirstStep()) {
          this.currentStep++;
        }
      },
      error: (error) => console.error('Verifing email in failed', error.error.errors)
    });
  }
  async onSubmit() {

  await this.uploadFile();
  this.fileName = await this.uploadFile();
  const data = {
    firstName: this.firstName,
    lastName: this.lastName,
    emailAddress: this.emailAddress,
    password: this.password,
    otp: this.otpValue,
    avatar: this.fileName,
    isAdmin: true,
  }
    console.log(data);
    this.apiService.POST("/Auth/signUp", data).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response);
          this.currentStep = 0;
          this.firstName = '';
          this.lastName = '';
          this.emailAddress = "";
          this.profileImage = null;
          this.password = '';
          this.confirmPassword = '';
          this.otpValue = ''
          }
          },
      error: (error) => console.error('Sign in failed', error.error)
    });
  }
          
  
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  validateFirstStep(): boolean {
    return true;
  }
  onOtpComplete(otp: string): void {
    console.log('OTP is complete:', otp);
    this.otpValue = otp;
    // You can auto-submit here if desired
    // this.verifyOtp();
  }
  
  onOtpChange(otp: string): void {
    console.log('OTP changed:', otp);
    this.otpValue = otp;
  }
  
  verifyOtp(): void {
    console.log('Verifying OTP:', this.otpValue);
    // Your verification logic here
    alert(`Verifying OTP: ${this.otpValue}`);
  }
  
  resetOtp(): void {
    this.otpValue = '';
    // If you're using ViewChild:
    // this.otpComponent.reset();
  }

}

