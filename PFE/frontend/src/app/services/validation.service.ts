// validation.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  // Validation patterns
  private readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly NAME_PATTERN = /^[a-zA-Z ]{2,30}$/;
  
  // Password requirements
  private readonly PASSWORD_MIN_LENGTH = 8;
  private readonly PASSWORD_REQUIRES_UPPERCASE = true;
  private readonly PASSWORD_REQUIRES_LOWERCASE = true;
  private readonly PASSWORD_REQUIRES_NUMBER = true;
  private readonly PASSWORD_REQUIRES_SPECIAL = true;
  
  constructor() {}
  
  /**
   * Validates an email address
   * @param email The email to validate
   * @returns Error message if invalid, empty string if valid
   */
  validateEmail(email: string): string {
    if (!email) {
      return 'Email is required';
    }
    
    if (!this.EMAIL_PATTERN.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }
  
  /**
   * Validates a name
   * @param name The name to validate
   * @returns Error message if invalid, empty string if valid
   */
  validateName(name: string): string {
    if (!name) {
      return 'Name is required';
    }
    
    if (name.length < 2) {
      return 'Name must be at least 2 characters';
    }
    
    if (!this.NAME_PATTERN.test(name)) {
      return 'Name should contain only letters and spaces';
    }
    
    return '';
  }
  
  /**
   * Validates a password with configurable requirements
   * @param password The password to validate
   * @returns Error message if invalid, empty string if valid
   */
  validatePassword(password: string): string {
    if (!password) {
      return 'Password is required';
    }
    
    if (password.length < this.PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${this.PASSWORD_MIN_LENGTH} characters`;
    }
    
    if (this.PASSWORD_REQUIRES_UPPERCASE && !/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (this.PASSWORD_REQUIRES_LOWERCASE && !/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (this.PASSWORD_REQUIRES_NUMBER && !/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    
    if (this.PASSWORD_REQUIRES_SPECIAL && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    
    return '';
  }
  
  /**
   * Validates a confirmation password
   * @param password Original password
   * @param confirmPassword Password confirmation to validate
   * @returns Error message if invalid, empty string if valid
   */
  validateConfirmPassword(password: string, confirmPassword: string): string {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    return '';
  }
  
  /**
   * Generic validator for any field type
   * @param value The value to validate
   * @param type The type of validation to perform
   * @param options Additional options for validation
   * @returns Error message if invalid, empty string if valid
   */
  validate(value: string, type: 'email' | 'name' | 'password' | 'confirmPassword', options?: any): string {
    switch (type) {
      case 'email':
        return this.validateEmail(value);
      case 'name':
        return this.validateName(value);
      case 'password':
        return this.validatePassword(value);
      case 'confirmPassword':
        if (!options?.password) {
          return 'Original password is required for comparison';
        }
        return this.validateConfirmPassword(options.password, value);
      default:
        return '';
    }
  }
}