import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HoverBorderEffectComponent } from "../../ui/hover-border-effect/hover-border-effect.component";
import { APIService } from '../../../services/api.service';
import { IssuePriorityPipe } from '../../../Pipes/issue-priority.pipe';

@Component({
  selector: 'app-story-point-input',
  standalone: true,
  imports: [CommonModule, HoverBorderEffectComponent, IssuePriorityPipe],
  templateUrl: './story-point-input.component.html',
  styleUrl: './story-point-input.component.css'
})
export class StoryPointInputComponent {
  @Input() currentStoryPoint: string = '';
  @Input() issueId: string = '';
  @Output() storyPointChanged = new EventEmitter<string>();
  
  storyPoints: string[] = ['Zero','One','Two','Three','Five','Eight','Thirteen','Twenty','Forty','OneHundred'];

  isOpen: boolean = false;

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    if (!this.currentStoryPoint && this.storyPoints.length > 0) {
      this.currentStoryPoint = this.storyPoints[0];
    }
    
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.state-dropdown')) {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.closeDropdown);
  }

  private closeDropdown = (event: Event) => {
    if (!(event.target as Element).closest('.state-dropdown')) {
      this.isOpen = false;
    }
  };

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectStoryPoint(storyPoint: string): void {
    this.currentStoryPoint = storyPoint;
    this.storyPointChanged.emit(storyPoint);
    if (this.issueId) {
      this.apiService.PUT(`/Ticket/updateTicketStoryPoint?ticketId=${this.issueId}&difficulty=${storyPoint}`)
        .subscribe({
          next: (response: any) => {
            console.log('Story point updated successfully');
          },
          error: (error: any) => {
            console.error('Error updating Story point:', error);
          }
        });
    }
    
    this.isOpen = false;
  }
}