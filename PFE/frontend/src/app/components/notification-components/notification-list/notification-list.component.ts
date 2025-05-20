import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { formatDistance } from 'date-fns';
import { NotificationDTO, NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-list',
  imports: [
    CommonModule,
    RouterModule,
  ],
  template: `
    <div class="notifications-container">
      <div class="notifications-header">
        <h2>Notifications</h2>
        <div class="notification-actions">
          <button 
            *ngIf="hasUnreadNotifications"
            (click)="markAllAsRead()" 
            class="mark-all-read">
            Mark all as read
          </button>
        </div>
      </div>

      <div *ngIf="notifications.length === 0" class="empty-state">
        <p>No notifications yet</p>
      </div>
      
      <div class="notification-list">
        <div 
          *ngFor="let notification of notifications" 
          class="notification-item"
          [ngClass]="{'unread': !notification.isRead}"
          (click)="handleNotificationClick(notification)">

          <div class="notification-icon" [ngClass]="notification.type">
            <i class="material-icons">{{getIconForType(notification.type)}}</i>
          </div>
          
          <div class="notification-content">
            <div class="notification-message">{{notification.message}}</div>
            <div class="notification-time">{{formatTimestamp(notification.timestamp)}}</div>
          </div>
          
          <div class="notification-actions">
            <button 
              (click)="deleteNotification(notification.id, $event)" 
              class="delete-notification">
              <i class="material-icons">close</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .notification-list {
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .notification-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      background-color: #fff;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .notification-item:hover {
      background-color: #f9f9f9;
    }
    
    .notification-item.unread {
      background-color: #e8f4fd;
    }
    
    .notification-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 1rem;
      background-color: #ddd;
    }
    
    .notification-icon.task {
      background-color: #4caf50;
      color: white;
    }
    
    .notification-icon.mention {
      background-color: #2196f3;
      color: white;
    }
    
    .notification-icon.comment {
      background-color: #ff9800;
      color: white;
    }
    
    .notification-icon.project {
      background-color: #9c27b0;
      color: white;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-message {
      margin-bottom: 0.25rem;
    }
    
    .notification-time {
      font-size: 0.8rem;
      color: #666;
    }
    
    .notification-actions {
      display: flex;
      align-items: center;
    }
    
    .mark-all-read {
      padding: 0.5rem 1rem;
      background-color: transparent;
      border: 1px solid #2196f3;
      color: #2196f3;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    
    .delete-notification {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #999;
      display: flex;
      padding: 0.25rem;
    }
    
    .delete-notification:hover {
      color: #f44336;
    }
    
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
      background-color: #f9f9f9;
      border-radius: 4px;
    }
  `]
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: NotificationDTO[] = [];
  hasUnreadNotifications = false;
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
        this.hasUnreadNotifications = notifications.some(n => !n.isRead);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  formatTimestamp(timestamp: Date): string {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  }

  getIconForType(type: string): string {
    switch (type.toLowerCase()) {
      case 'task':
        return 'assignment';
      case 'mention':
        return 'alternate_email';
      case 'comment':
        return 'comment';
      case 'project':
        return 'folder';
      default:
        return 'notifications';
    }
  }

  handleNotificationClick(notification: NotificationDTO): void {
    this.notificationService.processNotificationClick(notification);
    
    // Navigate based on notification type and projectId
    if (notification.projectId) {
      this.router.navigate(['/projects', notification.projectId]);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(
      () => {
        // Update local notification status
        const updatedNotifications = this.notifications.map(n => {
          return { ...n, isRead: true, readAt: new Date() };
        });
        
        // Update the observable
        this.notificationService['notificationsSubject'].next(updatedNotifications);
        this.notificationService['updateUnreadCount']();
      },
      error => console.error('Error marking all notifications as read:', error)
    );
  }

  deleteNotification(id: string, event: Event): void {
    event.stopPropagation(); // Prevent triggering the parent click event
    
    this.notificationService.deleteNotification(id).subscribe(
      () => {
        // Remove from local notifications
        const updatedNotifications = this.notifications.filter(n => n.id !== id);
        this.notificationService['notificationsSubject'].next(updatedNotifications);
        this.notificationService['updateUnreadCount']();
      },
      error => console.error('Error deleting notification:', error)
    );
  }
}