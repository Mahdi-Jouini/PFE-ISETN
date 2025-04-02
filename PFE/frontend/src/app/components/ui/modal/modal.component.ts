import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Modal Title';
  
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.isOpen = false;
    this.closeModal.emit();
  }
  
  closeOnOverlay(event: MouseEvent) {
    this.close();
  }
}
