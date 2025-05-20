import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Issue } from '../../../interfaces/issue';
import { APIService } from '../../../services/api.service';
import { SelectInputComponent } from "../../ui/select-input/select-input.component";
import { IssuePriorityPipe } from '../../../Pipes/issue-priority.pipe';
import { AssigneesAvatarGroupComponent } from "../../member-components/assignees-avatar-group/assignees-avatar-group.component";
import { IssueIconComponent } from "../issue-icon/issue-icon.component";
import { ModalComponent } from "../../ui/modal/modal.component";
import { IconButtonComponent } from "../../ui/icon-button/icon-button.component";
import { CreateIssueComponent } from "../create-issue/create-issue.component";


@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, SelectInputComponent, IssuePriorityPipe, AssigneesAvatarGroupComponent, IssueIconComponent, ModalComponent, IconButtonComponent, CreateIssueComponent],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.css',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('0.1s', style({ opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('0.1s', style({ opacity: 0}))
        ])
      ]
    ),
  ]
})
export class IssueListComponent {
  issues: Issue[] = [];
  @Input() sprintId: string = '';
  @Input() projectId: string = '';
  @Output() issueSelected = new EventEmitter<Issue>();
  @ViewChildren('Issue') elements!: QueryList<ElementRef>;
  
  hoverStyles = { top: '0px', left: '0px', opacity: '0', width: '0'};
  hovered = false;

  currentHoverSprint: number = -1;
  currentHoverIssue: number = -1;

  statusStates: string[] = [
    'ToDo',
    'InProgress',
    'Review',
    'Testing',
    'Done'
  ];

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.apiService.GET_All(`/Ticket/getAllTicketsBySprint?sprintId=${this.sprintId}`).subscribe({
      next: (response: any) => {      
        this.issues = response;
        console.log(response)
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  hover(index: number) {
    const el = this.elements.toArray()[index].nativeElement;
    this.hovered = true;
    this.hoverStyles = {
      top: `${el.offsetTop}px`,
      left: `${el.offsetLeft}px`,
      opacity: '1',
      width: `${el.offsetWidth}px`
    };
  }
  
  unhover() {
    this.hovered = false;
  }
  
  selectIssue(issue: Issue) {
    this.issueSelected.emit(issue);
  }

  onStateChanged(issue: Issue, newState: string): void {
    issue.status = newState;
    console.log(`Issue ${issue.title} status changed to: ${newState}`);
    this.apiService.PUT(`/Ticket/updateTicketState?ticketId=${issue.ticketId}&state=${newState}`)
    .subscribe({
      next: (response: any) => {
        console.log('Status updated successfully');
      },
      error: (error: any) => {
        console.error('Error updating status:', error);
      }
    });
  }

  onCreateIssueResult(createdIssue: Issue, modal: any) {
    console.log('Issue creation result:', createdIssue);
    
    if (createdIssue && createdIssue.ticketId) {
      console.log('Adding new issue to list:', createdIssue);
      this.issues = [...this.issues, createdIssue];
      modal.closeModal();
    } else {
      console.error('Invalid issue object received');
    }
  }
}