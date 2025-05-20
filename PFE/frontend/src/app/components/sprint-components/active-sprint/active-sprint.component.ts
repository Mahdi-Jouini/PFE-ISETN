import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Sprint } from '../../../interfaces/sprint';

@Component({
  selector: 'app-active-sprint',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-sprint.component.html',
  styleUrl: './active-sprint.component.css'
})
export class ActiveSprintComponent implements OnChanges {
  @Input() sprint!: Sprint;
  remainingText: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sprint']) {
      this.updateRemainingText();
    }
  }
  
  get remainingDays(): number {
    if (!this.sprint?.completionDate) return 0;
    
    const today = new Date();
    const completionDate = new Date(this.sprint.completionDate);
    const diffTime = completionDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  private updateRemainingText(): void {
    if (!this.sprint?.completionDate) {
      this.remainingText = 'No completion date set';
      return;
    }
    
    const days = this.remainingDays;
    
    if (days < 0) {
      this.remainingText = 'Sprint overdue';
    } else if (days === 0) {
      this.remainingText = 'Due today';
    } else if (days === 1) {
      this.remainingText = '1 day remaining';
    } else {
      this.remainingText = `${days} days remaining`;
    }
  }
}