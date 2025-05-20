import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Message, MessageService } from '../../services/message.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { APIService } from '../../services/api.service';
import { HoverBorderEffectComponent } from "../../components/ui/hover-border-effect/hover-border-effect.component";

@Component({
  selector: 'app-project-chat',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HoverBorderEffectComponent
],
  templateUrl: './project-chat.component.html',
  styleUrls: ['./project-chat.component.css']
})
export class ProjectChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  messages: Message[] = [];
  chatForm = new FormGroup({
    messageInput: new FormControl('', [Validators.required])
  });
  currentUserId!: string;
  private messagesSubscription!: Subscription;
  isLoading = true;
  sendingMessage = false;

  private route = inject(ActivatedRoute);
  projectId = this.route.snapshot.params['id'];

  constructor(
    private messageService: MessageService,
    private authService: AuthenticationService,
    private apiService: APIService
  ) { }

  ngOnInit(): void {
    
    this.getCurrentUserId();
    this.route.paramMap.subscribe(params => {
      const newProjectId = params.get('id');
      if (newProjectId && newProjectId !== this.projectId) {
        this.projectId = newProjectId;
        this.connectToChat();
      } else if (newProjectId && !this.messages.length) {
        // Initial load or refresh
        this.projectId = newProjectId;
        this.connectToChat();
      }
    });

    this.messagesSubscription = this.messageService.messages$.subscribe(
      messages => {
        this.messages = messages;
        this.isLoading = false;
        // Scroll to bottom when new messages arrive
        setTimeout(() => this.scrollToBottom(), 100);
      }
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.messageService.leaveCurrentProjectChat();
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  connectToChat(): void {
    this.isLoading = true;
    this.messageService.joinProjectChat(this.projectId);
  }

  sendMessage(event?: Event): void {
    // Prevent form submission which causes page reload
    if (event) {
      event.preventDefault();
    }
    
    if (this.chatForm.valid && !this.sendingMessage) {
      const messageContent = this.chatForm.get('messageInput')?.value;
      
      if (!messageContent) return;
      
      this.sendingMessage = true;
      
      this.messageService.sendMessage(messageContent).subscribe({
        next: () => {
          this.chatForm.reset();
          this.sendingMessage = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.sendingMessage = false;
        }
      });
    }
  }

  getCurrentUserId(): void {
    this.authService.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUserId = response.userId
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      }
    });
  }

  deleteMessage(messageId: string): void {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        // The message will be removed from the list via SignalR notification
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      }
    });
  }

  isCurrentUserMessage(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  formatMessageTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer && this.chatContainer.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) { 
      console.error('Error scrolling to bottom:', err);
    }
  }

  avatarUrl(fileUrl?: string): string {return this.apiService.GET_FILE(fileUrl)} 
}