import { Component, inject, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Issue } from '../../../interfaces/issue';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { ScrumBoardIssueComponent } from "../../issue-components/scrum-board-issue/scrum-board-issue.component";
import { ActiveSprintComponent } from "../active-sprint/active-sprint.component";
import { Sprint } from '../../../interfaces/sprint';

@Component({
  selector: 'app-scrum-board',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, ScrumBoardIssueComponent, ActiveSprintComponent],
  templateUrl: './scrum-board.component.html',
  styleUrl: './scrum-board.component.css'
})
export class ScrumBoardComponent implements OnInit {
  status: string[] = ['ToDo', 'InProgress', 'Review', 'Testing', 'Done'];
  activeSprint!: Sprint;
  issues: Issue[] = [];

  private route = inject(ActivatedRoute);
  projectId = this.route.snapshot.params['id'];

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.fetchActiveSprint()
    
  }

  fetchActiveSprint(): void {
    this.apiService.GET('/Sprint/getActiveSprint?projectId=', this.projectId).subscribe({
      next: (response: any) => {      
        this.activeSprint = response;
        this.fetchIssues();
      },
      error: (error: any) => {
        console.error('Error fetching issues:', error);
      }
    }); 
  }

  fetchIssues(): void {
    if (!this.activeSprint || !this.activeSprint.sprintId) {
      console.error('No active sprint available');
      return;
    }
    this.apiService.GET_All(`/Ticket/getAllTicketsBySprint?sprintId=${this.activeSprint.sprintId}`).subscribe({
      next: (response: any) => {      
        this.issues = response;
      },
      error: (error: any) => {
        console.error('Error fetching issues:', error);
      }
    }); 
  }

  getIssuesByStatus(status: string): Issue[] {
    return this.issues.filter(issue => issue.status === status);
  }

  onStateChange(issue: Issue, newState: string): void {
    this.apiService.PUT(`/Ticket/updateTicketState?ticketId=${issue.ticketId}&state=${newState}`)
    .subscribe({
      next: (response: any) => {
        issue.status = newState;
        console.log('Status updated successfully');
      },
      error: (error: any) => {
        console.error('Error updating status:', error);
      }
    });
  }

  drop(event: CdkDragDrop<Issue[]>, newState: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const issue = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      issue.status = newState;
      this.onStateChange(issue, newState);
    }
  }

  getDropListConnections(currentStatus: string): string[] {
    return this.status
      .filter(s => s !== currentStatus)
      .map(s => `${s}List`);
  }
}