import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MemberRolePipe } from '../../Pipes/member-role.pipe';
import { APIService } from '../../services/api.service';
import { Member } from '../../interfaces/member';
import { ModalComponent } from "../ui/modal/modal.component";
import { DynamicInputComponent } from "../ui/dynamic-input/dynamic-input.component";
import { FormsModule } from '@angular/forms';
import { IconButtonComponent } from "../ui/icon-button/icon-button.component";
import { tick } from '@angular/core/testing';
import { log } from 'console';
import { UserBannerComponent } from "../ui/user-banner/user-banner.component";
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-members',
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    DynamicInputComponent,
    IconButtonComponent,
    UserBannerComponent
],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {

  @Input() ProjectId: string = '';
  members: Member[] = [];
  user!: User ;
  groupedMembers: { [role: number]: Member[] } = {};
  roles: string[] = ['Product Owner', 'Scrum Master', 'Developer', 'Tester']

  isModalOpen = false;
  Role = ""
  emailAddress = ""

  constructor(private apiService: APIService) {}

  avatarUrl(fileUrl: string): string {return this.apiService.GET_FILE(fileUrl)} 

  ngOnInit() {
    this.apiService.GET("/Member/getMembersByProject?projectId=", this.ProjectId ).subscribe({
      next: (response) => {
        this.members = response;
        this.groupMembers();
        console.log( this.groupedMembers)
      },
      error: (error) => {
        console.error(error);
      }
    });
  }



  private groupMembers(): void {
    this.roles.forEach((_, index) => {
      this.groupedMembers[index] = [];
    });
    for (const member of this.members) {
      if (member.role >= 0 && member.role < this.roles.length) {
        this.groupedMembers[member.role].push(member);
      }
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  onModalClose() {
    this.isModalOpen = false;
    this.Role = ""
  }

  getRole(role: string){
    this.Role = role
  }

  findUser(){
    this.apiService.GET("/User/getUserByEmail?email=", this.emailAddress).subscribe({
      next: (response) => {
        this.user = response;
        },
        error: (error) => {
          console.error(error);
          }
    })
  }

  addMember(role: string){
    this.apiService.POST('/Member/PostMember',{
      userId: this.user.userId,
      projectId: this.ProjectId,
      role: Number(role),
    }).subscribe({
      next: (response) => {
        this.members.push(response.member);
        this.groupMembers();
        this.isModalOpen = false;
        this.Role = ""
        },
        error: (error) => {
          console.error(error);
        }
    })
  }

}