import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { Attachment } from '../../../interfaces/attachment';
import { ModalComponent } from "../../ui/modal/modal.component";
import { IconButtonComponent } from "../../ui/icon-button/icon-button.component";
import { MultipleFileUploadComponent } from "../../ui/multiple-file-upload/multiple-file-upload.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
  standalone: true,
  imports: [ModalComponent, IconButtonComponent, MultipleFileUploadComponent, CommonModule],
})
export class AttachmentComponent implements OnInit, OnChanges {


  @Input() projectId?: string;
  @Input() sprintId?: string;
  @Input() ticketId?: string;

  @ViewChild('MultipleFileUploadRef') multipleFileUploadComponent!: MultipleFileUploadComponent;
  @ViewChild('Modal') modal!: ModalComponent;

  attachments: Attachment[] = [];

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.loadAttachments();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] || changes['sprintId'] || changes['ticketId']) {
      this.loadAttachments();
    }
  }
  
  private loadAttachments(): void {
    let endpoint = '';
    if (this.projectId) {
      endpoint = `/File/getAllAttachmentByProject?projectId=${this.projectId}`;
    } else if (this.sprintId) {
      endpoint = `/File/getAllAttachmentBySprint?sprintId=${this.sprintId}`;
    } else if (this.ticketId) {
      endpoint = `/File/getAllAttachmentByTicket?ticketId=${this.ticketId}`;
    } else {
      console.warn('No attachment ID (project, sprint, ticket) was provided.');
      return;
    }
  
    this.apiService.GET_All(endpoint).subscribe({
      next: (response: any) => {
        this.attachments = response;
        console.log(this.attachments);
      },
      error: (error: any) => {
        console.error('Error loading attachments:', error);
      }
    });
  }
  

  uploadAttachment(): void{
    if (this.projectId) {
      this.multipleFileUploadComponent.projectId = this.projectId;
    } else if (this.sprintId) {
      this.multipleFileUploadComponent.sprintId = this.sprintId;
    } else if (this.ticketId) {
      this.multipleFileUploadComponent.issueId = this.ticketId;
    } else {
      console.warn('No valid ID provided for uploading attachments.');
      return;
    }
    this.multipleFileUploadComponent.uploadFilesObservable().subscribe({
      next: () => {
        this.loadAttachments();   // Refresh list AFTER upload
        this.modal.closeModal();  // Close modal after upload
      },
      error: (err) => {
        console.error('Upload failed:', err);
      }
    });
  }

  getPDF() {
    var file = new Blob([''], { type: 'application/pdf' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
    var a = document.createElement('a');
    a.href = fileURL;
    document.body.appendChild(a);
    a.click();
  }

  avatarUrl(fileUrl?: string): string {return this.apiService.GET_FILE(fileUrl)}

  getAttachmentIcon(type: string): string {
    switch(type) {
      case 'application/pdf': return 'bi bi-filetype-pdf';
      default: return 'bi bi-question';
    }
  }
}
