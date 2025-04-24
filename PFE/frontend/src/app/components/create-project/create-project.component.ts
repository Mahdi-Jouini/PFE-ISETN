import { Component } from '@angular/core';
import { DynamicInputComponent } from "../ui/dynamic-input/dynamic-input.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from "../ui/file-upload/file-upload.component";

@Component({
  selector: 'app-create-project',
  imports: [
    DynamicInputComponent,
    FormsModule,
    CommonModule,
    FileUploadComponent
],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  project_title = ""
  project_description = ""
}
