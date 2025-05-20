import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface Notification {
  id: string;
  type: string;
  projectId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  sprintId?: string;
  ticketId?: string;
  invitationId?: string;
  messageId?: string;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  // Additional fields for UI display
  projectName?: string;
  sprintName?: string;
  ticketTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private unreadNotificationsSubject = new BehaviorSubject<number>(0);
  public unreadNotifications$ = this.unreadNotificationsSubject.asObservable();
  private connectionInitialized = false;
  private token: string = '';

  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router
  ) {
    if (isPlatformBrowser(platformId)) {
      this.token = localStorage.getItem('auth_token') || '';
    }
    this.initializeSignalRConnection();
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  private initializeSignalRConnection(): void {
    const token = localStorage.getItem('auth_token');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(`http://localhost:5230/notificationHub`, {
        accessTokenFactory: () => token ?? '',
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      const currentNotifications = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...currentNotifications]);
      
      // Update unread count
      if (!notification.isRead) {
        this.unreadNotificationsSubject.next(this.unreadNotificationsSubject.value + 1);
      }
    });

    this.startConnection();
  }

  private async startConnection(): Promise<void> {
    try {
      if (this.hubConnection.state !== signalR.HubConnectionState.Connected && !this.connectionInitialized) {
        await this.hubConnection.start();
        console.log('SignalR notifications connection started');
        this.connectionInitialized = true;
        
        // Load notifications after connection is established
        this.loadUserNotifications();
      }
    } catch (err) {
      console.error('Error starting SignalR notifications connection:', err);
      // Retry connection after a delay
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public loadUserNotifications(): void {
    this.getUserNotifications().subscribe(
      notifications => {
        this.notificationsSubject.next(notifications);
        const unreadCount = notifications.filter(n => !n.isRead).length;
        this.unreadNotificationsSubject.next(unreadCount);
      },
      error => console.error('Error loading user notifications:', error)
    );
  }

  public getUserNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/Notifications/user`, {
      headers: this.getHeaders()
    });
  }

  public getProjectNotifications(projectId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.apiUrl}/Notifications/project/${projectId}`, {
      headers: this.getHeaders()
    });
  }

  public markAsRead(notificationId: string): Observable<any> {
    return new Observable(observer => {
      this.http.put(`${environment.apiUrl}/Notifications/markAsRead/${notificationId}`, {}, {
        headers: this.getHeaders()
      }).subscribe(
        response => {
          // Update local state
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(n => {
            if (n.id === notificationId && !n.isRead) {
              // Decrease unread count
              const currentUnreadCount = this.unreadNotificationsSubject.value;
              this.unreadNotificationsSubject.next(Math.max(0, currentUnreadCount - 1));
              return { ...n, isRead: true };
            }
            return n;
          });
          this.notificationsSubject.next(updatedNotifications);
          
          observer.next(response);
          observer.complete();
        },
        error => {
          console.error('Error marking notification as read:', error);
          observer.error(error);
        }
      );
    });
  }

  public markAllAsRead(): Observable<any> {
    return new Observable(observer => {
      this.http.put(`${environment.apiUrl}/Notifications/markAllAsRead`, {}, {
        headers: this.getHeaders()
      }).subscribe(
        response => {
          // Update local state
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(n => ({ ...n, isRead: true }));
          this.notificationsSubject.next(updatedNotifications);
          this.unreadNotificationsSubject.next(0);
          
          observer.next(response);
          observer.complete();
        },
        error => {
          console.error('Error marking all notifications as read:', error);
          observer.error(error);
        }
      );
    });
  }

  public deleteNotification(notificationId: string): Observable<any> {
    return new Observable(observer => {
      this.http.delete(`${environment.apiUrl}/Notifications/${notificationId}`, {
        headers: this.getHeaders()
      }).subscribe(
        response => {
          // Update local state
          const currentNotifications = this.notificationsSubject.value;
          const notificationToRemove = currentNotifications.find(n => n.id === notificationId);
          
          if (notificationToRemove && !notificationToRemove.isRead) {
            // Decrease unread count if it was unread
            const currentUnreadCount = this.unreadNotificationsSubject.value;
            this.unreadNotificationsSubject.next(Math.max(0, currentUnreadCount - 1));
          }
          
          this.notificationsSubject.next(currentNotifications.filter(n => n.id !== notificationId));
          
          observer.next(response);
          observer.complete();
        },
        error => {
          console.error('Error deleting notification:', error);
          observer.error(error);
        }
      );
    });
  }
  
  // Helper methods for the UI component
  public getIconForNotificationType(type: string): string {
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

  public processNotificationClick(notification: Notification): void {
    this.markAsRead(notification.id).subscribe(
      () => {
        // Navigate based on notification type
        if (notification.projectId) {
          // Navigate to project
          if (notification.sprintId) {
            // Navigate to sprint
            if (notification.ticketId) {
              // Navigate to ticket
              this.router.navigate(['/projects', notification.projectId, 'sprints', notification.sprintId, 'tickets', notification.ticketId]);
            } else {
              // Navigate to sprint
              this.router.navigate(['/projects', notification.projectId, 'sprints', notification.sprintId]);
            }
          } else if (notification.messageId) {
            // Navigate to messages
            this.router.navigate(['/projects', notification.projectId, 'messages']);
          } else {
            // Navigate to project
            this.router.navigate(['/projects', notification.projectId]);
          }
        }
      },
      error => console.error('Error marking notification as read:', error)
    );
  }
}