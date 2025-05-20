import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-issue-icon',
  imports: [],
  templateUrl: './issue-icon.component.html',
  styleUrl: './issue-icon.component.css'
})
export class IssueIconComponent {
@Input() type!: string

getIssueIcon(type: string): string {
  switch(type) {
    case 'Feature': return 'bi bi-lightbulb-fill';
    case 'Bug': return 'bi bi-bug-fill';
    case 'Story': return 'bi bi-bookmark-fill';
    case 'Test': return 'bi bi-exclamation-diamond-fill';
    case 'Task': return 'bi bi-clipboard-check-fill';
    case 'Improvement': return 'bi bi-arrow-up-circle-fill';
    default: return 'bi bi-question';
  }
}

getIssueColor(type: string): string {
  switch(type) {
    case 'Feature': return '#36B37E';
    case 'Bug': return '#FF5630';
    case 'Story': return '#6554C0';
    case 'Test': return '#FFAB00';
    case 'Task': return '#0052CC';
    case 'Improvement': return '#00C7E6';
    default: return '#999999';
  }
}

}
