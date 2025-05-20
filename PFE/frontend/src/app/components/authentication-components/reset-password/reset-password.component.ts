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
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicInputComponent,
    OtpComponent,
    MatStepperModule,
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  private fb = inject(FormBuilder);
  otpValue = '';


  SendEmailForm = this.fb.group({
    emailAddress:[''],
  });

  resetPasswordForm = this.fb.group({
    password: [''],
    confirmPassword: [''],
  }, {
    validators: this.matchPasswords
  });

  verifyOtpForm = this.fb.group({
    otp: ['']
  });

  get emailAddress(): string {
    return this.SendEmailForm.get('emailAddress')?.value || '';
  }

  fieldValidity: { [key: string]: boolean } = {
    password: false,  
  };

  constructor(private apiService: APIService, private AuthenticationService: AuthenticationService) {}

  onSendEmail( stepper: MatStepper ): void {
    if (!this.SendEmailForm.valid) return;

    console.log('Sending verification email to:', this.emailAddress);
    this.apiService.POST("/Auth/sendOtp", `"${this.emailAddress}"`).subscribe({
      next: (response) => {
        console.log('OTP sent:', response)
        if (stepper) {
          stepper.next();
        }
      },
      error: error => console.error('OTP error:', error)
    });
  }

onVerifyIdentity(stepper?: MatStepper): void {
  const otp = this.otpValue;

  if (!otp || !this.emailAddress) {
    console.error("Email or OTP missing");
    return;
  }

  this.apiService.POST('/Auth/verifyOtp', {
    emailAddress: this.emailAddress,
    otp: otp
  }).subscribe({
    next: (res: any) => {
      if (res.isValid) {
        console.log("OTP Verified!");
        if (stepper) stepper.next();
      } else {
        console.warn("Invalid OTP.");
      }
    },
    error: (err) => {
      console.error("OTP verification failed:", err);
    }
  });
}

onResetPassword(): void {
  const password = this.resetPasswordForm.get('password')?.value;

  if (!this.resetPasswordForm.valid || !this.emailAddress || !this.otpValue) {
    console.warn("Form not valid or required data missing.");
    return;
  }

  const payload = {
    emailAddress: this.emailAddress,
    password: password,
    otp: this.otpValue
  };
  console.log(payload)

  this.apiService.POST('/Auth/resetPassword', payload).subscribe({
    next: (res: any) => {
      console.log("Password reset successful:", res);
    },
    error: (err) => {
      console.error("Password reset failed:", err);
    }
  });
}


  isAllValid(): boolean { 
    return Object.values(this.fieldValidity).every(valid => valid);
  }

  onOtpComplete(otp: string): void {
    this.otpValue = otp;
    this.verifyOtpForm.get('otp')?.setValue(otp);
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
