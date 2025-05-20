import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DynamicInputComponent } from "../../ui/dynamic-input/dynamic-input.component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Sprint } from '../../../interfaces/sprint';
import { APIService } from '../../../services/api.service';
import { SelectInputComponent } from "../../ui/select-input/select-input.component";

@Component({
  selector: 'app-create-sprint',
  imports: [DynamicInputComponent,  ReactiveFormsModule, SelectInputComponent],
  templateUrl: './create-sprint.component.html',
  styleUrl: './create-sprint.component.css'
})
export class CreateSprintComponent {
  @Input() projectId: string = ""; 
  @Output() createSprintResult = new EventEmitter<Sprint>();

  sprint_duration: string = "TwoWeeks";
  sprintDurations: string[] = ['OneWeek', 'TwoWeeks', 'ThreeWeeks', 'FourWeeks'];

  constructor(private apiService: APIService) {}

  private fb = inject(FormBuilder);
  fillInformationForm = this.fb.group({
    title: [''],
    description: [''],
    duration: [''],
    projectId: [''],
  });
  fieldValidity: { [key: string]: boolean } = {
    title: false,
    description: false, 
    duration: false, 
    projectId: false
  };

  onDurationChanged(duration: string): void {
    this.sprint_duration= duration;
  }

  createSprint(): void {
    this.fillInformationForm.patchValue({
      duration: this.sprint_duration,
      projectId: this.projectId
    });
  
    if (this.fillInformationForm.invalid) {
      console.warn("Form is invalid", this.fillInformationForm.value);
      return;
    }
  
    const sprintData = this.fillInformationForm.value

    console.log(sprintData)
  
    this.apiService.POST("/Sprint/createSprint", sprintData).subscribe({
      next: (response: any) => {
        console.log('Create sprint response:', response);
        this.createSprintResult.emit(response.sprint);
      },
      error: (error) => {
        console.error('Error creating sprint:', error);
        this.createSprintResult.emit(null as any);
      }
    });
  }

}
