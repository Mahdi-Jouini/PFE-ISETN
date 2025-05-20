// file-upload.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { HoverBorderEffectComponent } from "../hover-border-effect/hover-border-effect.component";
import { APIService } from '../../../services/api.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

interface FileInfo {
  file: File;
  name: string;
  size: string;
  type: string;
  progress: number;
}

@Component({
  selector: 'app-multiple-file-upload',
  standalone: true,
  imports: [CommonModule, HoverBorderEffectComponent],
  templateUrl: './multiple-file-upload.component.html',
  styleUrls: ['./multiple-file-upload.component.css']
})
export class MultipleFileUploadComponent {
  projectId: string = '';
  sprintId: string = '';
  issueId: string = '';
  files: FileInfo[] = [];
  dragAreaClass: string = 'dragarea';
  
  constructor(private apiService: APIService) {}

  onFileChange(event: any): void {
    const fileList: FileList = event.target.files;
    this.processFiles(fileList);
  }

  onDragOver(event: any): void {
    event.preventDefault();
    this.dragAreaClass = 'dragarea-highlight';
  }
  
  onDragLeave(event: any): void {
    event.preventDefault();
    this.dragAreaClass = 'dragarea';
  }
  
  onDrop(event: any): void {
    event.preventDefault();
    this.dragAreaClass = 'dragarea';
    const fileList: FileList = event.dataTransfer.files;
    this.processFiles(fileList);
  }

  processFiles(fileList: FileList): void {
    if (fileList && fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!this.files.some(f => f.name === file.name && f.size === this.formatSize(file.size))) {
          this.files.push({
            file: file,
            name: file.name,
            size: this.formatSize(file.size),
            type: (file.type).split('/').pop() || 'Unknown',
            progress: 0
          });
        }
      }
    }
  }

  formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }



  uploadFilesObservable(): Observable<any> {
    const fileList = this.files.map(f => f.file);
  
    return this.apiService.uploadAndAttachFiles(fileList, {
      projectId: this.projectId,
      sprintId: this.sprintId,
      ticketId: this.issueId
    }).pipe(
      tap(() => {
        this.files = [];
      })
    );
  }
  

}