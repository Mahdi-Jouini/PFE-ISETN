// product-backlog.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Sprint } from '../../interfaces/sprint';
import { Issue } from '../../interfaces/issue';
import { APIService } from '../../services/api.service';
import { IssueListComponent } from "../../components/issue-components/issue-list/issue-list.component";
import { SprintDrawerComponent } from "../../components/sprint-components/sprint-drawer/sprint-drawer.component";
import { IconButtonComponent } from "../../components/ui/icon-button/icon-button.component";
import { ModalComponent } from "../../components/ui/modal/modal.component";
import { CreateSprintComponent } from "../../components/sprint-components/create-sprint/create-sprint.component";
import { ReadEditIssueComponent } from "../../components/issue-components/read-edit-issue/read-edit-issue.component";
import {trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-product-backlog',
  imports: [CommonModule, IssueListComponent, SprintDrawerComponent, ModalComponent, IconButtonComponent, CreateSprintComponent, ReadEditIssueComponent],
  templateUrl: './product-backlog.component.html',
  styleUrls: ['./product-backlog.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        width: '400px',
        opacity: 1,
        display: 'block',
      })),
      state('out', style({
        width: '0px',
        opacity: 0,
        display: 'none',
      })),
      transition('out => in', animate('300ms ease-out')),
      transition('in => out', animate('200ms ease-in')),
    ]),
  ]
})
export class ProductBacklogComponent implements OnInit {
  sprints: Sprint[] = [];
  issueSelected!: Issue;
  createMode = '';

  private route = inject(ActivatedRoute);
  projectId = this.route.snapshot.params['id'];

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.apiService.GET_All(`/Sprint/getAllSprintsByProject?projectId=${this.projectId}`).subscribe({
      next: (response: any) => {      
        this.sprints = response;
        console.log(response);
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  onIssueSelected(issue: Issue) {
    this.issueSelected = issue;
    this.createMode = 'ReadMode';
  }

  onCreateSprintResult(createdSprint: Sprint, modal: any) {
    console.log('Sprint creation result:', createdSprint);
    
    if (createdSprint && createdSprint.sprintId) {
      console.log('Adding new sprint to list:', createdSprint);
      this.sprints = [...this.sprints, createdSprint];
      modal.closeModal();
    } else {
      console.error('Invalid sprint object received');
    }
  }

}