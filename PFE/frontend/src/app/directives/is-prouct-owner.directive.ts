import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';

@Directive({
  selector: '[appIsProuctOwner]',
  standalone: true
})
export class IsProuctOwnerDirective implements OnInit  {
  @Input() appIsProuctOwner: string = '';
  
  constructor(
    private element: ElementRef,
    private apiService: APIService
  ) {}

  ngOnInit() {
    this.apiService.GET("/Member/isProductOwner?projectId=", this.appIsProuctOwner).subscribe({
      next: (response: any) => {
        console.log('Is product owner: ' + response);
        },
        error: (error: any) => {
          console.log('Is product owner: ' + error);
          this.element.nativeElement.remove();
        }
    })
  }
}
