import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { APIService } from '../../services/api.service';
import { Member } from '../../interfaces/member';
import { Project } from '../../interfaces/project';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { UserBannerComponent } from '../../components/user-components/user-banner/user-banner.component';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [CommonModule, UserBannerComponent],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('0.1s', style({ opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('0.1s', style({ opacity: 0}))
        ])
      ]
    )
  ]
})
export class AllProjectsComponent {
  
  @ViewChildren('Card') elements!: QueryList<ElementRef>;
  hoverStyles = { top: '0px', left: '0px', opacity: '0' }
  hovered = false ;
  projects! : Project[];

  constructor(private apiService: APIService, private router: Router) { }

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

  hover(index: number) {
    const el = this.elements.toArray()[index];
    const { x, y } = el.nativeElement.getBoundingClientRect();
    this.hovered = true ;
    this.hoverStyles  = {
      top: `${y}px`,
      left: `${x}px`,
      opacity: '1',
      
    }
  }
  unhover(){
    this.hovered = false;
  }

  navigate(root : string){
    this.router.navigate(['/'+root]);
  }

}
