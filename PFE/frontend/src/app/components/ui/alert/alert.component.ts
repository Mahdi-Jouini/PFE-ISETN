import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports:[CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() type: 'error' | 'warning' | 'info' | 'success' = 'info';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  @Output() close = new EventEmitter<void>();

  get alertClass(): string {
    return `alert alert-${this.type}`;
  }

  iconClass (): string {
    switch (this.type) {
      case 'error': return 'bi bi-shield-fill-x';
      case 'warning': return 'bi bi-shield-fill-exclamation';
      case 'success': return 'bi bi-shield-fill-check';
      case 'info': return 'bi bi-info-circle-fill';
      default: return 'bi bi-info-circle-fill';
    }
  }

  closeAlert(): void {
    this.close.emit();
  }
}