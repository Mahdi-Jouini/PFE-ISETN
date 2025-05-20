import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface Message {
  messageId: string;
  content: string;
  sentAt: Date;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  projectId: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messageSubject.asObservable();
  private currentProjectId: string | null = null;
  private connectionInitialized = false;
  private token: string = '';


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: object) {
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
      .withUrl(`http://localhost:5230/chatHub`, {
        accessTokenFactory: () => token ?? '',
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      if (message.projectId === this.currentProjectId) {
        const currentMessages = this.messageSubject.value;
        this.messageSubject.next([...currentMessages, message]);
      }
    });

    this.hubConnection.on('MessageDeleted', (messageId: string) => {
      const currentMessages = this.messageSubject.value;
      this.messageSubject.next(currentMessages.filter(m => m.messageId !== messageId));
    });
  }

  public async joinProjectChat(projectId: string): Promise<void> {
    this.leaveCurrentProjectChat();
    this.currentProjectId = projectId;

    try {
      if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
        if (!this.connectionInitialized) {
          await this.hubConnection.start();
          console.log('SignalR connection started');
          this.connectionInitialized = true;
        }
      }

      await this.hubConnection.invoke('JoinProjectChat', projectId);
      console.log(`Joined chat for project ${projectId}`);

      this.getProjectMessages(projectId).subscribe(
        messages => this.messageSubject.next(messages),
        error => console.error('Error loading project messages:', error)
      );
    } catch (err) {
      console.error('Error joining project chat:', err);
    }
  }

  public leaveCurrentProjectChat(): void {
    if (this.currentProjectId && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('LeaveProjectChat', this.currentProjectId)
        .catch(err => console.error('Error leaving project chat:', err));
    }
    this.currentProjectId = null;
    this.messageSubject.next([]);
  }

  public getProjectMessages(projectId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/Message/getProjectMessages?projectId=${projectId}`);
  }

  public sendMessage(content: string): Observable<Message> {
    if (!this.currentProjectId) {
      throw new Error('No project selected for messaging');
    }

    const messageDto = {
      content,
      projectId: this.currentProjectId
    };

    return this.http.post<Message>(`${environment.apiUrl}/Message/sendMessage`, messageDto,
      {
        headers: this.getHeaders()
      });
  }

  public deleteMessage(messageId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Message/deleteMessage?messageId=${messageId}`);
  }
}
