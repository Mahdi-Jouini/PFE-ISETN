import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIService } from '../../../services/api.service';
import { AlertComponent } from "../../ui/alert/alert.component";
import { DynamicInputComponent } from "../../ui/dynamic-input/dynamic-input.component";
import { AuthenticationService } from '../../../services/authentication.service';
import { ModalComponent } from "../../ui/modal/modal.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    DynamicInputComponent,
    ModalComponent,
    ResetPasswordComponent
],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  userForm: FormGroup;

  showAlert = false;
  alertType: 'error' | 'warning' | 'info' | 'success' = 'error';
  alertMessage = '';


  constructor(private fb: FormBuilder, private AuthenticationService: AuthenticationService) {
    this.userForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }
  
  onSubmit(): void {
    console.log(this.userForm)
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
      this.AuthenticationService.signIn(this.userForm.value).subscribe({
        next: (response) => {
          this.displayAlert('success', 'Sign in successful!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error) => {
          console.log(error);
          this.displayAlert('error', error.error.message || "Login failed.");
          setTimeout(() => this.onAlertClose(), 2000);
        }
      });      
    }
  }

  displayAlert(type: 'error' | 'warning' | 'info' | 'success', message: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;
  }
  
  onAlertClose() {
    this.showAlert = false;
  }
}