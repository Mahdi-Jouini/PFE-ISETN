import { Component, Input } from '@angular/core';
import { Issue } from '../../../interfaces/issue';
import { IssuePriorityPipe } from '../../../Pipes/issue-priority.pipe';
import { AssigneesAvatarGroupComponent } from "../../member-components/assignees-avatar-group/assignees-avatar-group.component";
import { IssueIconComponent } from "../issue-icon/issue-icon.component";

@Component({
  selector: 'app-scrum-board-issue',
  imports: [IssuePriorityPipe, AssigneesAvatarGroupComponent, IssueIconComponent],
  templateUrl: './scrum-board-issue.component.html',
  styleUrl: './scrum-board-issue.component.css'
})
export class ScrumBoardIssueComponent {
@Input() issue!: Issue;
@Input() projectId!: string
}
