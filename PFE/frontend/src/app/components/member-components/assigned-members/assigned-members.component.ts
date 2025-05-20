import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../../interfaces/member';
import { APIService } from '../../../services/api.service';
import { UserBannerComponent } from "../../user-components/user-banner/user-banner.component";

@Component({
  selector: 'app-assigned-members',
  imports: [UserBannerComponent],
  templateUrl: './assigned-members.component.html',
  styleUrl: './assigned-members.component.css'
})
export class AssignedMembersComponent implements OnInit {
  @Input() issueId: string = '';
  assignees: Member[] = [];
  showDropdown: boolean = false;
  
  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.loadAssignees();
  }
  
  loadAssignees(): void {
    this.apiService.GET_All(`/Member/getAssignedMembers?ticketId=${this.issueId}`).subscribe({
      next: (response) => {      
        this.assignees = response;
      },
      error: (error) => {
        if(error.status != 404){
          console.error('Error loading assignees:', error);  
        }
        
      }
    });
  }

}
