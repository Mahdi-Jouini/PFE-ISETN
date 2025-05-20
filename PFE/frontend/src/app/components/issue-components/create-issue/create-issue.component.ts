import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DynamicInputComponent } from "../../ui/dynamic-input/dynamic-input.component";
import { Issue } from '../../../interfaces/issue';
import { APIService } from '../../../services/api.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectInputComponent } from "../../ui/select-input/select-input.component";

@Component({
  selector: 'app-create-issue',
  imports: [DynamicInputComponent, ReactiveFormsModule, SelectInputComponent],
  templateUrl: './create-issue.component.html',
  styleUrl: './create-issue.component.css'
})
export class CreateIssueComponent {
  @Input() sprintId!: string;
  @Output() createIssueResult = new EventEmitter<Issue>();
  
  issue!: Issue;
  issue_type: string = 'Select Type' ;
  
  private fb = inject(FormBuilder);
  createIssueForm = this.fb.group({
    type: [''],
    title: [''],
    description: [''],
    sprintId: ['']
  });

  fieldValidity: { [key: string]: boolean } = {
    title: false,
    description: false,
  };

  issueTypes: string[] = [        
    "Bug",
    "Feature",
    "Improvement",
    "Story",
    "Task",
    "Test",
  ];
  
  constructor(private apiService: APIService) {}
  onTypeChanged(issue: Issue, newState: string): void {
    this.issue_type= newState;
  }
  createIssue(): void {
    this.createIssueForm.patchValue({
      type: this.issue_type,
      sprintId: this.sprintId
    });
  
    if (this.createIssueForm.invalid) {
      console.warn("Form is invalid", this.createIssueForm.value);
      return;
    }

    const isuueData = this.createIssueForm.value;
    this.apiService.POST("/Ticket/createTicket", isuueData).subscribe({
      next: (response: any) => {
        console.log('Create issue response:', response);
        this.createIssueResult.emit(response.ticket);
      },
      error: (error) => {
        console.error('Error creating issue:', error);
        this.createIssueResult.emit(null as any);
      }
    });
  }


}
