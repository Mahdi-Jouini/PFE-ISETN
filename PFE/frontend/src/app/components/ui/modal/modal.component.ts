// modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ContentChild, Directive, Input } from '@angular/core';
import { ModalTriggerDirective } from '../../../directives/modal-trigger.directive';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  isOpen = false;
  @Input() ModalTitle!: string ;
  
  @ContentChild(ModalTriggerDirective)
  customTrigger?: ModalTriggerDirective;
  
  constructor(private elementRef: ElementRef) {}
  
  openModal() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }
  
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.isOpen && event.target === this.elementRef.nativeElement.querySelector('.modal-overlay')) {
      this.closeModal();
    }
  }
}