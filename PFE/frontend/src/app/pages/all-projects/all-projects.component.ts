import { Component } from '@angular/core';
import { CardItem, CardsHoverEffectComponent } from "../../components/ui/cards-hover-effect/cards-hover-effect.component";
import { APIService } from '../../services/api.service';
import { log } from 'console';

@Component({
  selector: 'app-all-projects',
  imports: [CardsHoverEffectComponent],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css'
})
export class AllProjectsComponent {
  constructor(private apiService: APIService) { }

  projects! : CardItem[];

  ngOnInit(): void {
    this.apiService.GET_All('/Project/getAllProjects').subscribe({
      next: (response: any) => {      
        this.projects = response;
        console.log(this.projects);
        
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
    })
  }



  /*featureItems: CardItem[] = [
    {
      title: 'CodeFix AI Assistant',
      description: 'An intelligent tool that detects bugs in code and suggests real-time fixes using machine learning. Supports multiple programming languages and integrates into popular IDEs.',
      link: '/analytics',
      avatar: 'http://localhost:5230/api/File/2.jpg',
      userName: 'Foued Tahan',
      createdAt: '20/3/2025',
    },

  ];*/
}
