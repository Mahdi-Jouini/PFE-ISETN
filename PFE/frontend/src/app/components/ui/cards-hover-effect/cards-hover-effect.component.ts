import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { APIService } from '../../../services/api.service';

export interface CardItem {
  projectId: string;
  title: string;
  description: string;
  link: string;
  createdDate: string
  productOwner:{
    avatar: string;
    firstName: string;
    lastName: string;
  }

}

@Component({
  selector: 'app-cards-hover-effect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards-hover-effect.component.html',
  styleUrl: './cards-hover-effect.component.css',
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
export class CardsHoverEffectComponent {
  @Input() items: CardItem[] = [];
  @Input() className: string = '';
  @ViewChildren('Card') elements!: QueryList<ElementRef>;
  hoverStyles = { top: '0px', left: '0px', opacity: '0' }
  hovered = false ;

  constructor(private router: Router, private apiService: APIService) {}

  avatarUrl(fileUrl: string): string {return this.apiService.GET_FILE(fileUrl)} 

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
