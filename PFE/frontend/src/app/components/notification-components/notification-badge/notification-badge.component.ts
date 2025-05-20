import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { DrawerComponent } from "../../ui/drawer/drawer.component";

@Component({
  selector: 'app-notification-badge',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatBadgeModule,
    MatIconModule,
    DrawerModule,
    ButtonModule,
    DrawerComponent
  ],
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.css'],
})
export class NotificationBadgeComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  notificationCount = 5;
  isDrawerOpen = false;
  drawerTitle = 'Notifications';
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to notifications
    this.subscriptions.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );
    
    // Subscribe to unread count
    this.subscriptions.add(
      this.notificationService.unreadNotifications$.subscribe(count => {
        this.unreadCount = count;
      })
    );
    
    // Load initial notifications
    this.notificationService.loadUserNotifications();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  onDrawerClosed(): void {
    this.isDrawerOpen = false;
    console.log('Drawer was closed');
  }

  showMore(): void {
    this.notificationCount += 5;
  }

  showLess(): void {
    this.notificationCount = 5;
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      if (days === 1) {
        return 'Yesterday';
      } else if (days <= 7) {
        return `${days}d ago`;
      } else {
        // Format as date for older notifications
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      }
    }
  }

  getIconForType(type: string): string {
    // Default implementation - update this or add the method to your service
    switch (type) {
      case 'ProjectCreated':
      case 'ProjectUpdated':
      case 'ProjectDeleted':
        return 'folder';
      case 'MemberInvited':
      case 'MemberJoined':
      case 'MemberLeft':
      case 'MemberRoleChanged':
        return 'people';
      case 'SprintCreated':
      case 'SprintStarted':
      case 'SprintCompleted':
        return 'directions_run';
      case 'TicketCreated':
      case 'TicketAssigned':
      case 'TicketStatusChanged':
      case 'TicketCompleted':
        return 'assignment';
      case 'MessageReceived':
        return 'message';
      default:
        return 'notifications';
    }
  }

  handleNotificationClick(notification: Notification): void {
    // Use the service's method that already includes navigation logic
    this.notificationService.processNotificationClick(notification);
    this.isDrawerOpen = false;
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(
      () => {
        console.log('All notifications marked as read');
      },
      error => console.error('Error marking all notifications as read:', error)
    );
  }
}