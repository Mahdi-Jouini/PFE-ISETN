import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Router } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-side-bar',
  imports: [ CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  animations: [
    trigger('sidebarAnimation', [
      state('closed', style({
        width: '80px'
      })),
      state('open', style({
        width: '200px'
      })),
      transition('closed <=> open', [
        animate('0.3s ease-in-out')
      ])
    ]),
    trigger('labelAnimation', [
      state('visible', style({
        width: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('hidden', style({
        width: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('expanded <=> collapsed', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
  
})

export class SideBarComponent {

  items: SidebarItem[] = [
    { label: 'Contact', icon: 'team_dashboard', link: '/contact' },
    { label: 'Home', icon: 'view_day', link: 'product-backlog' },
    { label: 'About', icon: 'view_week', link: '/product-backlog' },
    { label: 'Contact', icon: 'forum', link: '/contact' },
    { label: 'Contact', icon: 'settings', link: '/contact' },
  ];

  open = false;
  sidebar_label = { width: '0px' };
  constructor(private router: Router) {}

  toggle(){
    this.open = !this.open;
    if (this.open){
      this.sidebar_label ={
        width: '120px'
      }
    }
  }
  navigate(root : string){
    this.router.navigate(['/'+root]);
  }


}
