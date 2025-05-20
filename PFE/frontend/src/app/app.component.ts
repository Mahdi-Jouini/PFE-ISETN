import { Component } from '@angular/core';
import { ChildrenOutletContexts, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navigation-components/navbar/navbar.component";
import { SideBarComponent } from "./components/navigation-components/side-bar/side-bar.component";
import { filter } from 'rxjs';
import { NotificationToastComponent } from "./components/notification-components/notification-toast/notification-toast.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SideBarComponent, NotificationToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  currentUrl: string = '';
  
  private sidebarPaths: string[] = [
    '/all-projects',
    '/project',
    '/product-backlog',
    '/create-project',
    '/scrum-board',
    '/chat'
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
    });
  }

  shouldShowSidebar(): boolean {
    return this.sidebarPaths.some(path => this.currentUrl.startsWith(path));
  }
}
