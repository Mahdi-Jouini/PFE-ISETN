import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Sprint } from '../../interfaces/sprint';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { IconButtonComponent } from "../../components/ui/icon-button/icon-button.component";

@Component({
  selector: 'app-product-backlog',
  imports: [CommonModule, IconButtonComponent],
  templateUrl: './product-backlog.component.html',
  styleUrl: './product-backlog.component.css',
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
    trigger('collapseAnimation', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
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
export class ProductBacklogComponent {
  @ViewChildren('Issue') elements!: QueryList<ElementRef>;
  
  hoverStyles = { top: '0px', left: '0px', opacity: '0', width: '0px' };
  hovered = false;
  
  // Track collapsed state for each sprint individually
  collapsedState: {[key: number]: boolean} = {};
  
  collapse(sprintIndex: number) {
    this.collapsedState[sprintIndex] = !this.collapsedState[sprintIndex];
  }
  
  isCollapsed(sprintIndex: number): boolean {
    // Default to expanded (true) if not set
    return this.collapsedState[sprintIndex] !== false;
  }
  
  // Track which sprint and issue is being hovered
  currentHoverSprint: number = -1;
  currentHoverIssue: number = -1;
  
  hover(sprintIndex: number, issueIndex: number) {
    // Find the specific issue element
    let issueElements = this.elements.toArray();
    const elementIndex = this.getElementIndex(sprintIndex, issueIndex);
    if (elementIndex >= 0 && elementIndex < issueElements.length) {
      const el = issueElements[elementIndex];
      const { x, y, width } = el.nativeElement.getBoundingClientRect();
      this.hovered = true;
      this.currentHoverSprint = sprintIndex;
      this.currentHoverIssue = issueIndex;
      this.hoverStyles = {
        top: `${y}px`,
        left: `${x}px`,
        opacity: '1',
        width: `${width}px`
      };
    }
  }
  
  // Helper method to get the correct element index from sprint and issue indices
  getElementIndex(sprintIndex: number, issueIndex: number): number {
    let count = 0;
    for (let i = 0; i < sprintIndex; i++) {
      count += this.sprints[i].issues.length;
    }
    return count + issueIndex;
  }
  
  unhover() {
    this.hovered = false;
    this.currentHoverSprint = -1;
    this.currentHoverIssue = -1;
  }
  
  // Get icon based on issue type
  getIssueIcon(type: string): string {
    switch(type) {
      case 'Bug': return '🐛';
      case 'Test': return '🧪';
      case 'Task': return '📋';
      default: return '🛠️';
    }
  }
  
  // Multiple sprints
  sprints: Sprint[] = [
    {
      sprintNumber: 'Sprint 1',
      creationDate: '2025-04-15',
      issuesNumber: 3,
      state: 'Completed',
      issues: [
        {
          name: 'Fix login bug',
          state: 'Closed',
          priority: 'High',
          assignedTo: 'Alice',
          type: 'Bug'
        },
        {
          name: 'Add dashboard',
          state: 'Closed',
          priority: 'Medium',
          assignedTo: 'Bob',
          type: 'Task'
        },
        {
          name: 'Write unit tests',
          state: 'Closed',
          priority: 'Medium',
          assignedTo: 'Charlie',
          type: 'Test'
        }
      ]
    },
    {
      sprintNumber: 'Sprint 2',
      creationDate: '2025-04-22',
      issuesNumber: 4,
      state: 'In Progress',
      issues: [
        {
          name: 'Fix navigation bug',
          state: 'In Progress',
          priority: 'High',
          assignedTo: 'Alice',
          type: 'Bug'
        },
        {
          name: 'Update styling',
          state: 'In Review',
          priority: 'Low',
          assignedTo: 'Charlie',
          type: 'Task'
        },
        {
          name: 'Test authentication flow',
          state: 'Open',
          priority: 'Medium',
          assignedTo: 'Diana',
          type: 'Test'
        },
        {
          name: 'Implement user settings',
          state: 'Open',
          priority: 'Medium',
          assignedTo: 'Bob',
          type: 'Task'
        }
      ]
    },
    {
      sprintNumber: 'Sprint 3',
      creationDate: '2025-04-29',
      issuesNumber: 3,
      state: 'Planned',
      issues: [
        {
          name: 'Design notification system',
          state: 'Open',
          priority: 'High',
          assignedTo: 'Unassigned',
          type: 'Task'
        },
        {
          name: 'Fix performance issue',
          state: 'Open',
          priority: 'High',
          assignedTo: 'Unassigned',
          type: 'Bug'
        },
        {
          name: 'Test notification system',
          state: 'Open',
          priority: 'Medium',
          assignedTo: 'Unassigned',
          type: 'Test'
        }
      ]
    }
  ];
}