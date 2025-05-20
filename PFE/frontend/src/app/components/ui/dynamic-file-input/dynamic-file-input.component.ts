import {
  Component, EventEmitter, Input, Output, forwardRef
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator,
  AbstractControl, ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../services/api.service';

@Component({
  selector: 'dynamic-file-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-file-input.component.html',
  styleUrls: ['./dynamic-file-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFileInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DynamicFileInputComponent),
      multi: true
    }
  ]
})
export class DynamicFileInputComponent implements ControlValueAccessor, Validator {
  @Input() required: boolean = false;
  @Input() maxSizeMB: number = 2;
  @Input() upload: boolean = false;
  @Output() fileUploaded = new EventEmitter<string>();

  file: File | null = null;
  imageUrl: string | ArrayBuffer | null = "/assets/Default_pfp.svg";
  error: string = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private apiService: APIService) {}

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.error = '';
      this.imageUrl = null;

      if (!file.type.startsWith('image/')) {
        this.error = 'Only image files are allowed.';
        this.file = null;
        return;
      }

      if (this.maxSizeMB && file.size > this.maxSizeMB * 1024 * 1024) {
        this.error = `Max file size is ${this.maxSizeMB} MB.`;
        this.file = null;
        return;
      }

      this.file = file;
      const reader = new FileReader();
      reader.onload = () => (this.imageUrl = reader.result);
      reader.readAsDataURL(file);

      this.onChange(file);
    }
  }

  async uploadFile(): Promise<string | null> {
    if (!this.file) return null;

    try {
      const response = await this.apiService.FILE('/File', this.file).toPromise();
      this.fileUploaded.emit(response.fileName);
      return response.fileName;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  writeValue(): void {}
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !this.file) return { required: true };
    return this.error ? { fileError: this.error } : null;
  }
}
