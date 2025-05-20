import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { IconButtonComponent } from "../../ui/icon-button/icon-button.component";
import { DynamicInputComponent } from "../../ui/dynamic-input/dynamic-input.component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project } from '../../../interfaces/project';
import { ModalComponent } from '../../ui/modal/modal.component';
import { APIService } from '../../../services/api.service';
import { AttachmentComponent } from "../../attachment-components/attachment/attachment.component";

@Component({
  selector: 'app-read-edit-project',
  imports: [IconButtonComponent, DynamicInputComponent, ReactiveFormsModule, CommonModule, AttachmentComponent],
  templateUrl: './read-edit-project.component.html',
  styleUrl: './read-edit-project.component.css'
})
export class ReadEditProjectComponent {
  @Input() project!: Project;
  @Input() modalRef!: ModalComponent;

  isEditMode: boolean = false

  private fb = inject(FormBuilder);
  editProjectForm = this.fb.group({
    title: [''],
    description: [''],
    projectId: [''],
  });

  fieldValidity: { [key: string]: boolean } = {
    title: false,
    description: false,
  };

  constructor(private apiService: APIService) {}
    
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && changes['project'].currentValue) {
      this.editProjectForm.patchValue({
        title: this.project.title,
        description: this.project.description,
        projectId: this.project.projectId
      });
    }
  }

  editProject(): void{
    const projectData = this.editProjectForm.value;
    console.log(projectData)
    this.apiService.PUT("/Project/PutProject", projectData).subscribe({
      next: (response: any) => {
        console.log('Update project response:', response);
        if(projectData.title && projectData.description)
        {
          this.project.title = projectData.title;
          this.project.description = projectData.description;
          this.modalRef.closeModal();
        }
      },
      error: (error) => {
        console.error('Error updating project:', error);
      }
    });
  }
  
  onEditModeSwitch(): void{
    this.isEditMode = !this.isEditMode
  }
}
