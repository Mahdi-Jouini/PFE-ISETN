import { Component, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Sprint } from '../../../interfaces/sprint';
import { IconButtonComponent } from "../../ui/icon-button/icon-button.component";
import { DynamicInputComponent } from "../../ui/dynamic-input/dynamic-input.component";
import { AttachmentComponent } from "../../attachment-components/attachment/attachment.component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { APIService } from '../../../services/api.service';
import { ModalComponent } from '../../ui/modal/modal.component';

@Component({
  selector: 'app-read-edit-sprint',
  imports: [IconButtonComponent, DynamicInputComponent, AttachmentComponent, ReactiveFormsModule],
  templateUrl: './read-edit-sprint.component.html',
  styleUrl: './read-edit-sprint.component.css'
})
export class ReadEditSprintComponent {
  @Input() sprint!: Sprint
  @Input() modalRef!: ModalComponent;

  isEditMode: boolean = false

  private fb = inject(FormBuilder);
  editSprintForm = this.fb.group({
    title: [''],
    description: [''],
    sprintId: [''],
    projectId: [''],
  });

  fieldValidity: { [key: string]: boolean } = {
    title: false,
    description: false,
  };

  constructor(private apiService: APIService) {}
    
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sprint'] && changes['sprint'].currentValue) {
      this.editSprintForm.patchValue({
        title: this.sprint.title,
        description: this.sprint.description,
        sprintId: this.sprint.sprintId,
        projectId: this.sprint.projectId
      });
    }
  }

  editSprint(): void{
    const sprintData = this.editSprintForm.value;
    console.log(sprintData)
    this.apiService.PUT("/Sprint/updateSprint", sprintData).subscribe({
      next: (response: any) => {
        console.log('Update sprint response:', response);
        if(sprintData.title && sprintData.description)
        {
          this.sprint.title = sprintData.title;
          this.sprint.description = sprintData.description;
          this.modalRef.closeModal();
        }
      },
      error: (error) => {
        console.error('Error updating sprint:', error);
      }
    });
  }
  
  onEditModeSwitch(): void{
    this.isEditMode = !this.isEditMode
  }

}
