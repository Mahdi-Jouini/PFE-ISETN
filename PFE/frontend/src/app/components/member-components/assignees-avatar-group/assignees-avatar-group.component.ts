import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { Member } from '../../../interfaces/member';
import { CommonModule } from '@angular/common';
import { UserBannerComponent } from "../../user-components/user-banner/user-banner.component";

@Component({
  selector: 'app-assignees-avatar-group',
  standalone: true,
  imports: [CommonModule, UserBannerComponent],
  templateUrl: './assignees-avatar-group.component.html',
  styleUrl: './assignees-avatar-group.component.css'
})
export class AssigneesAvatarGroupComponent implements OnInit {
  @Input() issueId: string = '';
  @Input() projectId: string = '';
  Assignees: Member[] = [];
  members: Member[] = [];
  showDropdown: boolean = false;
  
  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.loadAssignees();
    this.fetchMembers();
  }
  
  loadAssignees(): void {
    this.apiService.GET_All(`/Member/getAssignedMembers?ticketId=${this.issueId}`).subscribe({
      next: (response: any) => {      
        this.Assignees = response;
      },
      error: (error: any) => {
        if(error.status != 404){
          console.error('Error loading assignees:', error);  
        }
      }
    });
  }

  fetchMembers() {
    this.apiService.GET("/Member/getMembersByProject?projectId=", this.projectId).subscribe({
      next: (response) => {
        this.members = response;
        console.log('Members loaded:', this.members);
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      }
    });
  }

  assignMember(memberId: string) {
    this.apiService.PUT(`/Ticket/assignMemberToTicket?ticketId=${this.issueId}&memberId=`, memberId).subscribe({
      next: (response) => {
        console.log('Member assigned successfully:', response);
        this.loadAssignees();
        this.toggleDropdown();
      },
      error: (error) => {
        console.error('Error assigning member:', error);
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    
    // If opening the dropdown, ensure we have the latest members
    if (this.showDropdown) {
      this.fetchMembers();
    }
  }

  avatarUrl(fileUrl: string): string {
    return this.apiService.GET_FILE(fileUrl);
  } 

  // Check if a member is already assigned
  isAssigned(memberId: string): boolean {
    return this.Assignees.some(assignee => assignee.memberId === memberId);
  }
}