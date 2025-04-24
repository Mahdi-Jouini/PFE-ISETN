// file-upload.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FileInfo {
  file: File;
  name: string;
  size: string;
  type: string;
  progress: number;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  files: FileInfo[] = [];
  dragAreaClass: string = 'dragarea';
  
  constructor() { }

  ngOnInit(): void {
  }

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
        
        // Check if file is already in the list
        if (!this.files.some(f => f.name === file.name && f.size === this.formatSize(file.size))) {
          this.files.push({
            file: file,
            name: file.name,
            size: this.formatSize(file.size),
            type: file.type || 'Unknown',
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

  uploadFiles(): void {
    // Simulate upload progress for each file
    this.files.forEach(fileInfo => {
      this.simulateUpload(fileInfo);
    });
  }

  private simulateUpload(fileInfo: FileInfo): void {
    // In a real application, replace this with actual HTTP upload logic
    const interval = setInterval(() => {
      if (fileInfo.progress < 100) {
        fileInfo.progress += 10;
      } else {
        clearInterval(interval);
      }
    }, 300);
  }
}