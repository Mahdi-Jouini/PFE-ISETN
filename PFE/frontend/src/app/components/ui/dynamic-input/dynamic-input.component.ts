// dynamic-input.component.ts
import { 
  Component, 
  Input as AngularInput, 
  forwardRef, 
  ElementRef, 
  ViewChild, 
  HostListener, 
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  FormsModule 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from "../icon-button/icon-button.component";
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'CustomInput',
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-input.component.html',
  styleUrl: './dynamic-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true
    }
  ]
})
export class DynamicInputComponent implements ControlValueAccessor, OnInit, OnChanges {
  @AngularInput() label: string = '';
  @AngularInput() type: string = 'text';
  @AngularInput() action: string = '';
  @AngularInput() placeholder: string = '';
  @AngularInput() name: string = '';
  @AngularInput() error: string = '';
  @AngularInput() validate: boolean = false;
  @AngularInput() validationType: 'email' | 'name' | 'password' | 'confirmPassword' | '' = '';
  @AngularInput() validationOptions: any = {};
  @AngularInput() compareValue: string = ''; // For password confirmation

  @ViewChild('inputContainer', { static: true }) 
  inputContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('inputElement', { static: true }) 
  inputElement!: ElementRef<HTMLInputElement>;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  file: File | null = null;

  value: string = '';
  disabled = false;
  validationError: string = '';
  dirty: boolean = false;
  
  private mouseX = 0;
  private mouseY = 0;
  private visible = false;
  private radius = 100;

  backgroundStyle: string = '';

  // ControlValueAccessor methods
  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private validationService: ValidationService) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const container = this.inputContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
    
    this.updateBackgroundStyle();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.visible = true;
    this.updateBackgroundStyle();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.visible = false;
    this.updateBackgroundStyle();
  }

  ngOnInit() {
    this.updateBackgroundStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['validate'] || changes['validationType'] || changes['value'] || changes['compareValue']) && this.dirty) {
      this.validateInput();
    }
  }

  private updateBackgroundStyle() {
    this.backgroundStyle = this.visible 
      ? `radial-gradient(
          ${this.radius}px circle at ${this.mouseX}px ${this.mouseY}px, 
          #3b82f6, 
          transparent 80%
        )`
      : '';
  }

  // Add this new method specifically for file inputs
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.file = file;
      this.value = file.name;
      this.onChange(file);
    }
  }

  // Keep the regular onInputChange method for non-file inputs
  onInputChange(event: any) {
    const value = event;
    this.value = value;
    this.onChange(value);
    this.dirty = true;
    
    if (this.validate && this.validationType) {
      this.validateInput();
    }
  }
  
  // Method to validate input based on type
  validateInput() {
    if (!this.validate || !this.validationType) {
      this.validationError = '';
      return;
    }

    // For password confirmation, add the compareValue to options
    if (this.validationType === 'confirmPassword') {
      this.validationOptions = {
        ...this.validationOptions,
        password: this.compareValue
      };
    }

    this.validationError = this.validationService.validate(
      this.value, 
      this.validationType,
      this.validationOptions
    );
  }
  
  writeValue(value: any): void {
    if (this.type === 'file' && value instanceof File) {
      this.file = value;
      this.value = value?.name || '';
    } else {
      this.value = value || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}