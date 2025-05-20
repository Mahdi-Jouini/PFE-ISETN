import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SidebarItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
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
  items: SidebarItem[] = [];
  open = false;
  sidebar_label = { width: '0px' };
  currentProjectId: string | null = null;
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.extractProjectIdFromUrl();
      this.updateSidebarItems();
    });
    
    this.extractProjectIdFromUrl();
    this.updateSidebarItems();
  }
  
  private extractProjectIdFromUrl(): void {
    const urlPath = this.router.url;
    // Update regex pattern to include scrum-board
    const projectIdRegex = /\/(project|product-backlog|sprint-dashboard|scrum-board|chat)\/([^\/]+)/;
    const match = urlPath.match(projectIdRegex);
    
    if (match && match[2]) {
      this.currentProjectId = match[2];
    } else {
      this.currentProjectId = null;
    }
  }
  
  private updateSidebarItems() {
    if (this.router.url === '/all-projects' || this.router.url === '/create-project') {
      // Project selection/creation menu
      this.items = [
        { label: 'Create Project', icon: 'add_circle', link: 'create-project' },
        { label: 'All Project', icon: 'grid_on', link: 'all-projects' },
      ];
    } else if (this.currentProjectId) {
      // Fixed the conditional check - removed accidental assignment operators
      const isProjectPage = 
        this.router.url === `/project/${this.currentProjectId}` ||
        this.router.url === `/product-backlog/${this.currentProjectId}` ||
        this.router.url === `/sprint-dashboard/${this.currentProjectId}` ||
        this.router.url === `/scrum-board/${this.currentProjectId}` ||
        this.router.url === `/chat/${this.currentProjectId}`;
      
      // Project navigation menu
      this.items = [
        { label: 'Project', icon: 'team_dashboard', link: `project/${this.currentProjectId}` },
        { label: 'Product Backlog', icon: 'view_day', link: `product-backlog/${this.currentProjectId}` },
        { label: 'Scrum Board', icon: 'view_week', link: `scrum-board/${this.currentProjectId}` },
        { label: 'Forum', icon: 'forum', link: `/chat/${this.currentProjectId}` },
        { label: 'Settings', icon: 'settings', link: 'settings' },
      ];
    }
  }

  toggle() {
    this.open = !this.open;
    if (this.open) {
      this.sidebar_label = {
        width: '120px'
      };
    } else {
      this.sidebar_label = {
        width: '0px'
      };
    }
  }
  
  navigate(route: string) {
    this.router.navigate(['/' + route]);
  }
}