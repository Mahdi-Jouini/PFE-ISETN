import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { Member } from '../../../interfaces/member';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { UserBannerComponent } from "../../user-components/user-banner/user-banner.component";
import { User } from '../../../interfaces/user';
import { SearchUserComponent } from "../../user-components/search-user/search-user.component";
import { IconButtonComponent } from "../../ui/icon-button/icon-button.component";
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule, UserBannerComponent, CdkDropList, CdkDrag,SearchUserComponent,
    IconButtonComponent
],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css',
  animations: [
    trigger('searchMemberAnimation', [
      state('visible', style({
        width: '300px',
        opacity: 1,
      })),
      state('hidden', style({
        width: '0px',
        opacity: 0,
      })),
      transition('visible <=> hidden', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class MembersComponent implements OnInit {
  @Input() ProjectId: string = '';
  
  Role = "";
  emailAddress = "";
  members: Member[] = [];
  searchResults: User[] = [];
  roleKeys: string[] = ['Product_Owner','SCRUM_Master', 'Developers', 'Testers', ];
  allDropListIds: string[] = ['searchResults'];
  searchMember: boolean = false ;

  get memberUsers(): User[] {
    return this.members.map(member => member.user);
  } 

  get membersByRole(): Record<string, User[]> {
    const roleMap: Record<string, User[]> = {
      SCRUM_Master: [],
      Developers: [],
      Testers: [],
      Product_Owner: []
    };
  
    this.members.forEach(member => {
      if (member.role in roleMap) {
        roleMap[member.role].push(member.user);
      }
    });
  
    return roleMap;
  }
  
  constructor(private apiService: APIService) {
    // Initialize the drop list IDs
    this.allDropListIds = ['searchResults', ...this.roleKeys];
  }
  
  ngOnInit() { 
    this.fetchMembers(); 
  }
  
  fetchMembers() {
    this.apiService.GET("/Member/getMembersByProject?projectId=", this.ProjectId).subscribe({
      next: (response) => {
        this.members = response;
        console.log('Members loaded:', this.members);
      },
      error: (error) => {
        console.error('Error fetching members:', error);
      }
    });
  }

  onSearchMember(){
    this.searchMember = !this.searchMember
  }

  drop(event: CdkDragDrop<User[]>, targetRole: string) {
    const user = event.previousContainer.data[event.previousIndex];
    
    if (event.previousContainer === event.container) {
      // Same container - just reorder
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between containers
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Handle the case when moving from searchResults
      if (event.previousContainer.id === 'searchResults') {
        this.addMemberToProject(user, targetRole);
      } 
      // Handle the case when moving between roles
      else if (event.previousContainer.id !== 'searchResults' && targetRole) {
        this.updateMemberRole(user, targetRole);
      }
    }
  }
  
  addMemberToProject(user: User, role: string) {
    this.apiService.POST("/Member/InviteMember", {
      projectId: this.ProjectId,
      userId: user.userId,
      role: role
    }).subscribe({
      next: () => {
        console.log(`Added user ${user.userId} as ${role}`);
        this.fetchMembers();
      },
      error: (err) => {
        console.error("Failed to add member:", err);
      }
    });
  }
  
  updateMemberRole(user: User, newRole: string) {
    // First, find the member to get their current role
    const member = this.members.find(m => m.user.userId === user.userId);
    if (!member) return;
    
    // Then update the role
    this.apiService.PUT(`/Member/UpdateMemberRole?memberId=${member.memberId}&role=${newRole}`).subscribe({
      next: () => {
        console.log(`Updated user ${user.userId} role to ${newRole}`);
        this.fetchMembers();
      },
      error: (err) => {
        console.error("Failed to update member role:", err);
      }
    });
  }
  
  onSearchResults(results: User[]) {
    this.searchResults = results;
  }
}