import { Component, Input } from '@angular/core';
import { IconButtonComponent } from "../../ui/icon-button/icon-button.component";
import { CommonModule } from '@angular/common';
import { Sprint } from '../../../interfaces/sprint';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { SelectInputComponent } from "../../ui/select-input/select-input.component";
import { APIService } from '../../../services/api.service';
import { ModalComponent } from "../../ui/modal/modal.component";
import { ReadEditSprintComponent } from "../read-edit-sprint/read-edit-sprint.component";

@Component({
  selector: 'app-sprint-drawer',
  imports: [CommonModule, IconButtonComponent, SelectInputComponent, ModalComponent, ReadEditSprintComponent],
  templateUrl: './sprint-drawer.component.html',
  styleUrl: './sprint-drawer.component.css',
  animations: [
    trigger('collapseAnimation', [
      state('expanded', style({
        height: '*',
        opacity: 1,
      })),
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('expanded <=> collapsed', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]

})
export class SprintDrawerComponent {
  @Input() sprint!: Sprint;
  SprintStates: string[] = [ 'NotStarted', 'InProgress', 'Completed', 'Cancelled']
  isCollapsedState = true;

  constructor(private apiService: APIService) {}

  collapse() {
    this.isCollapsedState = !this.isCollapsedState;
  }

  isCollapsed(): boolean {
    return this.isCollapsedState;
  }

  onStateChanged(sprint: Sprint, newState: string): void {
    sprint.sprintState = newState
    this.apiService.PUT(`/Sprint/updateSprintState?sprintId=${sprint.sprintId}&state=${newState}`)
    .subscribe({
      next: (response: any) => {
        console.log('Status updated successfully');
      },
      error: (error: any) => {
        console.error('Error updating status:', error);
      }
    });
  }
}

