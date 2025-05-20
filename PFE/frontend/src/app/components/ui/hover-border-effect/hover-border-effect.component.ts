import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hover-border-effect',
  imports: [],
  templateUrl: './hover-border-effect.component.html',
  styleUrl: './hover-border-effect.component.css'
})
export class HoverBorderEffectComponent {

 backgroundStyle: string = '';
  private mouseX = 0;
  private mouseY = 0;
  private visible = false;
  private radius = 100;
  
  @ViewChild('BorderHoverEffect ', { static: true }) 
  inputContainer!: ElementRef<HTMLDivElement>;

  private updateBackgroundStyle() {
    this.backgroundStyle = this.visible 
      ? `radial-gradient(
          ${this.radius}px circle at ${this.mouseX}px ${this.mouseY}px, 
          #3b82f6, 
          transparent 80%
        )`
      : '';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const container = this.inputContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
    
    this.updateBackgroundStyle();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.visible = true;
    this.updateBackgroundStyle();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.visible = false;
    this.updateBackgroundStyle();
  }

  ngOnInit() {
    this.updateBackgroundStyle();
  }

}
