import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIService } from '../../../services/api.service';
import { OtpComponent } from "../../ui/otp/otp.component";
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DynamicInputComponent } from '../../ui/dynamic-input/dynamic-input.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { DynamicFileInputComponent } from '../../ui/dynamic-file-input/dynamic-file-input.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicInputComponent,
    OtpComponent,
    MatStepperModule,
    DynamicFileInputComponent,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        displayDefaultIndicatorType: false,
        showError: true
      },
    },
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @ViewChild('fileInputRef') fileInputComponent!: DynamicFileInputComponent;

  uploadedAvatarFilename: string = '';


  private fb = inject(FormBuilder);
  otpValue = '';

  fillInformationForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    emailAddress: [''],
    password: [''],
    confirmPassword: [''],
    avatar: ['']
  }, {
    validators: this.matchPasswords
  });

  verifyEmailForm = this.fb.group({
    otp: ['']
  });

  fieldValidity: { [key: string]: boolean } = {
    firstName: false,
    lastName: false,
    emailAddress: false,
    password: false,  
  };

  constructor(private apiService: APIService, private AuthenticationService: AuthenticationService) {}

  isAllValid(): boolean { 
    return Object.values(this.fieldValidity).every(valid => valid);
  }
  
  get emailAddress(): string {
    return this.fillInformationForm.get('emailAddress')?.value || '';
  }
  
  handleVerifyAndNext(stepper: MatStepper) {
    this.onVerifyEmail();
    stepper.next();
  }
  

  onVerifyEmail(): void {
    if (!this.fillInformationForm.valid) return;

    console.log('Sending verification email to:', this.emailAddress);
    this.apiService.POST("/Auth/sendOtp", `"${this.emailAddress}"`).subscribe({
      next: response => console.log('OTP sent:', response),
      error: error => console.error('OTP error:', error)
    });
  }

  async onSignUp(): Promise<void> {
    if (this.fillInformationForm.invalid || this.verifyEmailForm.invalid) return;
  
    const fileName = await this.fileInputComponent.uploadFile();
    if (!fileName) {
      console.error("File upload failed");
      return;
    }
  
    this.fillInformationForm.get('avatar')?.setValue(fileName);
  
    const signupData = {
      ...this.fillInformationForm.value,
      otp: this.otpValue
    };
  
    console.log('Submitting signup data:', signupData);
  
    this.AuthenticationService.signUp(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        window.location.reload();
      },
      error: (error) => console.error('Signup failed', error.error)
    });
  }
  

  onAvatarUploaded(fileName: string): void {
    console.log('Avatar uploaded:', fileName);
    this.fillInformationForm.get('avatar')?.setValue(fileName);
  }
  

  onOtpComplete(otp: string): void {
    this.otpValue = otp;
    this.verifyEmailForm.get('otp')?.setValue(otp);
  }

  onOtpChange(otp: string): void {
    this.otpValue = otp;
  }

  private matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
}
