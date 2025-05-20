import { Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Issue } from '../../../interfaces/issue';
import { DynamicInputComponent } from "../../ui/dynamic-input/dynamic-input.component";
import { SelectInputComponent } from "../../ui/select-input/select-input.component";
import { APIService } from '../../../services/api.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StoryPointInputComponent } from "../story-point-input/story-point-input.component";
import { IconButtonComponent } from "../../ui/icon-button/icon-button.component";
import { MultipleFileUploadComponent } from "../../ui/multiple-file-upload/multiple-file-upload.component";
import { AttachmentComponent } from "../../attachment-components/attachment/attachment.component";

@Component({
  selector: 'app-read-edit-issue',
  imports: [DynamicInputComponent, ReactiveFormsModule, SelectInputComponent, StoryPointInputComponent, IconButtonComponent, AttachmentComponent],
  templateUrl: './read-edit-issue.component.html',
  styleUrl: './read-edit-issue.component.css'
})
export class ReadEditIssueComponent  implements OnChanges {
@Input() issue!: Issue;

isEditMode: boolean = false

statusStates: string[] = [
  'ToDo',
  'InProgress',
  'Review',
  'Testing',
  'Done'
];
private fb = inject(FormBuilder);
editIsuueForm = this.fb.group({
  ticketId: [''],
  title: [''],
  description: [''],
  sprintId: ['']
});

fieldValidity: { [key: string]: boolean } = {
  title: false,
  description: false,
};

constructor(private apiService: APIService) {}
    
ngOnChanges(changes: SimpleChanges): void {
  if (changes['issue'] && changes['issue'].currentValue) {
    this.editIsuueForm.patchValue({
      ticketId: this.issue.ticketId,
      title: this.issue.title,
      description: this.issue.description,
      sprintId: this.issue.sprintId
    });
  }
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

onStoryPointChanged(storyPoint: string): void {
  this.issue.difficulty = storyPoint;
}
editIssue(): void{
  const issueData = this.editIsuueForm.value;
  console.log(issueData)
  this.apiService.PUT("/Ticket/updateTicket", issueData).subscribe({
    next: (response: any) => {
      console.log('Update issue response:', response);
      if(issueData.title && issueData.description)
      {
      this.issue.title = issueData.title;
      this.issue.description = issueData.description;
      }
    },
    error: (error) => {
      console.error('Error updating issue:', error);
    }
  });
}



onEditModeSwitch(): void{
  this.isEditMode = !this.isEditMode
}

}


