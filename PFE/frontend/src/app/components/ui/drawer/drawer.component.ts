// drawer.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  imports:[
    CommonModule
  ],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
  animations: [
    trigger('drawerAnimation', [
      state('closed', style({
        transform: 'translateX(100%)'
      })),
      state('open', style({
        transform: 'translateX(0)'
      })),
      transition('closed => open', [
        animate('300ms ease-out')
      ]),
      transition('open => closed', [
        animate('300ms ease-in')
      ])
    ]),
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DrawerComponent {
  @Input() isOpen = false;
  @Input() title = 'Drawer';
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }
}