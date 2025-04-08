import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    CommonModule,      
    FormsModule
  ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  
  @Input() otpLength: number = 5;
  @Input() allowAlphanumeric: boolean = false;
  @Input() title: string = 'Verify Your Email';
  @Input() subtitle: string = 'Please enter the verification code we sent to';
  @Input() autoFocus: boolean = true;
  
  @Output() otpComplete = new EventEmitter<string>();
  @Output() otpChange = new EventEmitter<string>();
  
  otpArray: number[] = [];
  otp: string[] = [];
  isComplete = false;

  ngOnInit(): void {
    this.otpArray = Array(this.otpLength).fill(0);
    this.otp = Array(this.otpLength).fill('');
    
    if (this.autoFocus) {
      setTimeout(() => this.focusFirstInput(), 100);
    }
  }

  getOtpCode(): string {
    return this.otp.join("");
  }

  onOtpInputChange(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    
    // Validate input based on configuration
    if (value) {
      if (this.allowAlphanumeric) {
        // Allow alphanumeric
        if (!/^[a-zA-Z0-9]$/.test(value)) {
          this.otp[index] = '';
          inputElement.value = '';
          return;
        }
      } else {
        // Only allow numbers
        if (!/^\d$/.test(value)) {
          this.otp[index] = '';
          inputElement.value = '';
          return;
        }
      }
    }

    // Auto-focus to next input after entering a character
    if (value && index < this.otpLength - 1) {
      setTimeout(() => {
        this.otpInputs.get(index + 1)?.nativeElement.focus();
      }, 0);
    }

    // Check if OTP is complete
    this.checkCompletion();
    
    // Emit change event
    this.otpChange.emit(this.getOtpCode());
  }

  checkCompletion(): void {
    const wasComplete = this.isComplete;
    this.isComplete = this.otp.every(char => char !== '');
    
    if (this.isComplete && !wasComplete) {
      const otpCode = this.getOtpCode();
      console.log('OTP Completed:', otpCode);
      this.otpComplete.emit(otpCode);
    }
  }

  onKeyDown(index: number, event: KeyboardEvent): void {
    // Handle backspace
    if (event.key === 'Backspace') {
      if (this.otp[index] === '' && index > 0) {
        // If current field is empty and backspace is pressed, focus previous field
        setTimeout(() => {
          this.otpInputs.get(index - 1)?.nativeElement.focus();
        }, 0);
      }
    }
  }

  // Handle paste event
  onPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    
    const pastedText = clipboardData.getData('text');
    if (!pastedText) return;
    
    // Process pasted content
    const chars = this.processInput(pastedText);
    
    // Fill inputs with pasted characters
    for (let i = 0; i < this.otpLength; i++) {
      if (i < chars.length) {
        this.otp[i] = chars[i];
      }
    }
    
    // Focus on appropriate field after paste
    const nextIndex = Math.min(index + chars.length, this.otpLength - 1);
    setTimeout(() => {
      this.otpInputs.get(nextIndex)?.nativeElement.focus();
    }, 0);
    
    // Check if OTP is complete
    this.checkCompletion();
    
    // Emit change event
    this.otpChange.emit(this.getOtpCode());
  }

  // Process input to get valid characters
  private processInput(input: string): string[] {
    if (this.allowAlphanumeric) {
      // Filter to alphanumeric characters
      return input.split('')
        .filter(char => /^[a-zA-Z0-9]$/.test(char))
        .slice(0, this.otpLength);
    } else {
      // Filter to numbers only
      return input.split('')
        .filter(char => /^\d$/.test(char))
        .slice(0, this.otpLength);
    }
  }

  // Focus first input (useful for when component is shown)
  focusFirstInput(): void {
    setTimeout(() => {
      this.otpInputs.first?.nativeElement.focus();
    }, 0);
  }

  // Method to clear all inputs
  reset(): void {
    this.otp = Array(this.otpLength).fill('');
    this.isComplete = false;
    this.focusFirstInput();
    this.otpChange.emit('');
  }
  
  // Public method to get the current OTP value
  getValue(): string {
    return this.getOtpCode();
  }
}