import {
  Component,
  Input as AngularInput,
  forwardRef,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HoverBorderEffectComponent } from "../hover-border-effect/hover-border-effect.component";

@Component({
  selector: 'dynamic-input',
  standalone: true,
  imports: [CommonModule, FormsModule, HoverBorderEffectComponent,],
  templateUrl: './dynamic-input.component.html',
  styleUrl: './dynamic-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true
    }
  ]
})
export class DynamicInputComponent implements ControlValueAccessor, Validator {
  @AngularInput() label: string = '';
  @AngularInput() type: string = 'text';
  @AngularInput() placeholder: string = '';
  @AngularInput() name: string = '';
  @AngularInput() error: string = '';
  @AngularInput() editMode: boolean = false;
  @AngularInput() enableValidation: boolean = false;

  @AngularInput() validation: any = null;

  @Output() validityChanged = new EventEmitter<boolean>();

  @ViewChild('inputElement') inputElement!: ElementRef;

  value: string = '';
  disabled: boolean = false;
  validationError: string = '';
  dirty: boolean = false;

  private onChange = (_: any) => {};
  private onTouch = () => {};

  /*ngOnInit(): void {
    this.validateInput();
  }*/

  onInputChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.dirty = true;
    this.validateInput();
  }

  onBlur(): void {
    this.onTouch();
    this.dirty = true;
    this.validateInput();
  }

  validateInput(): void {
    let isValid = true;
    this.validationError = '';

    if (this.enableValidation && this.validation) {
      if (this.validation.required && (!this.value || this.value.trim() === '')) {
        this.validationError = 'This field is required';
        isValid = false;
      } else if (this.validation.minLength && this.value.length < this.validation.minLength) {
        this.validationError = `Minimum length is ${this.validation.minLength} characters`;
        isValid = false;
      } else if (this.validation.maxLength && this.value.length > this.validation.maxLength) {
        this.validationError = `Maximum length is ${this.validation.maxLength} characters`;
        isValid = false;
      }
    }

    this.validityChanged.emit(isValid);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.validate) return null;

    const value = control.value;

    if (this.validation?.required && (!value || value.trim() === '')) {
      return { required: true };
    }

    if (this.validation?.minLength && value?.length < this.validation.minLength) {
      return { minLength: { requiredLength: this.validation.minLength, actualLength: value.length } };
    }

    if (this.validation?.maxLength && value?.length > this.validation.maxLength) {
      return { maxLength: { requiredLength: this.validation.maxLength, actualLength: value.length } };
    }

    return null;
  }
}
