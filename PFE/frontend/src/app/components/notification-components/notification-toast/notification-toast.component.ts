import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.css']
})
export class NotificationToastComponent {
 /* notifications: any[] = [];
  latestNotification: any = null;
  unreadCount = 0;
  showToast = false;
  private lastNotificationId: string | null = null;
  private subscriptions: Subscription = new Subscription();
  private toastTimeout: any;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = [...notifications];

        if (notifications.length > 0) {
          const newest = notifications[0];

          if (newest.id !== this.lastNotificationId) {
            this.latestNotification = newest;
            this.lastNotificationId = newest.id;

            // Show toast and restart timeout
            this.showNotificationToast();
            this.cdr.detectChanges();
          }
        }
      })
    );

    this.subscriptions.add(
      this.notificationService.unreadNotificationsCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  handleNotificationClick(notification: any): void {
    this.notificationService.processNotificationClick(notification);
  }

  private showNotificationToast(): void {
    this.showToast = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000); // 5 seconds
  }*/
}
