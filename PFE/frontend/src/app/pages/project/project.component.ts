import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../services/api.service';
import { MembersComponent } from "../../components/members/members.component";
import { Project } from '../../interfaces/project';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  imports: [MembersComponent]
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
      },
      error: (error) => {
        console.error(error);
      }
    });

  }
}
