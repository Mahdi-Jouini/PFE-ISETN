import { 
  Component, 
  Input as AngularInput, 
  forwardRef, 
  ElementRef, 
  ViewChild, 
  HostListener, 
  OnInit 
} from '@angular/core';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  FormsModule 
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { log } from 'console';

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
export class DynamicInputComponent implements ControlValueAccessor, OnInit {
  @AngularInput() label: string = '';
  @AngularInput() type: string = 'text';
  @AngularInput() placeholder: string = '';
  @AngularInput() name: string = '';

  @ViewChild('inputContainer', { static: true }) 
  inputContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('inputElement', { static: true }) 
  inputElement!: ElementRef<HTMLInputElement>;

  value: string = '';
  disabled = false;
  
  private mouseX = 0;
  private mouseY = 0;
  private visible = false;
  private radius = 100;

  backgroundStyle: string = '';

  // ControlValueAccessor methods
  onChange = (_: any) => {};
  onTouched = () => {};

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

  private updateBackgroundStyle() {
    this.backgroundStyle = this.visible 
      ? `radial-gradient(
          ${this.radius}px circle at ${this.mouseX}px ${this.mouseY}px, 
          #3b82f6, 
          transparent 80%
        )`
      : '';
  }

  // Handle input change
  onInputChange(event: any) {
    console.log(event);
    const value = event;
    this.value = value;
    this.onChange(value);
    
    
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value || '';
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