// nav-bar-item.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, HostListener, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar-item',
  templateUrl: './nav-bar-item.component.html',
  styleUrl: './nav-bar-item.component.css',
  imports: [
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarItemComponent {
  @Input() root: string = '';
  @Input() label: string = '';

  isHovered = false;
  isDropdownOpen = false;
  
  constructor(private router: Router, private elementRef: ElementRef) {}
  
  onMouseEnter(): void {
    this.isHovered = true;
    this.isDropdownOpen = true;
  }
  
  onMouseLeave(): void {
    this.isHovered = false;
    this.isDropdownOpen = false;
  }
  
  toggleDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  navigate(): void {
    if (this.root) {
      this.router.navigate([this.root]);
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}