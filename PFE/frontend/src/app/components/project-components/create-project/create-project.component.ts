import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DynamicInputComponent } from '../../ui/dynamic-input/dynamic-input.component';
import { MultipleFileUploadComponent } from '../../ui/multiple-file-upload/multiple-file-upload.component';
import { APIService } from '../../../services/api.service';

@Component({
  selector: 'app-create-project',
  imports: [
    DynamicInputComponent,
    ReactiveFormsModule,
    CommonModule,
    MultipleFileUploadComponent
],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  projectId: string = '';
  @ViewChild('MultipleFileUploadRef') multipleFileUploadComponent!: MultipleFileUploadComponent;

  private fb = inject(FormBuilder);
  createProjectForm = this.fb.group({
    title: [''],
    description: [''],
  });

  fieldValidity: { [key: string]: boolean } = {
    title: false,
    description: false,
  };
  constructor(private apiService: APIService,  private router: Router){}

  createProject(){
    const projectData = this.createProjectForm.value;
    this.apiService.POST('/project/PostProject', projectData).subscribe({
      next: (res) => {
        this.multipleFileUploadComponent.projectId = res.projectId
        this.router.navigate(['/all-projects']);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

}
