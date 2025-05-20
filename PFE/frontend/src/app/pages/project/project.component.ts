import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../services/api.service';
import { MembersComponent } from "../../components/member-components/members/members.component";
import { Project } from '../../interfaces/project';
import { AttachmentComponent } from "../../components/attachment-components/attachment/attachment.component";
import { ReadEditProjectComponent } from "../../components/project-components/read-edit-project/read-edit-project.component";


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  imports: [MembersComponent, ReadEditProjectComponent]
})
export class ProjectComponent implements OnInit {

  private route = inject(ActivatedRoute);
  id = this.route.snapshot.params['id'];

  project!: Project;

  constructor(private apiService: APIService) {}

  ngOnInit() {
    this.apiService.GET("/Project/getProjectById?id=", this.id ).subscribe({
      next: (response) => {
        this.project = response
        console.log(response)
      },
      error: (error) => {
        console.error(error);
      }
    });

  }
}
