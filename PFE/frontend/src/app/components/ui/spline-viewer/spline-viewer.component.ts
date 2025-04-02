// spline-viewer.component.ts
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-spline-viewer',
  standalone: true,
  template: '<div #container class="spline-container"></div>',
  styles: [`
    .spline-container {
      width: 100%;
      height: 100%;
      min-height: 500px;
    }
  `]
})
export class SplineViewerComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef;
  @Input() url: string = '';
  
  private app: Application | null = null;

  constructor() {}

  ngOnInit(): void {
    // Initialize on ngOnInit to ensure the DOM element is available
  }

  ngAfterViewInit(): void {
    this.initSpline();
  }

  async initSpline(): Promise<void> {
    if (!this.container || !this.url) {
      console.error('Container or URL not provided');
      return;
    }

    try {
      this.app = new Application(this.container.nativeElement);
      await this.app.load(this.url);
      console.log('Spline scene loaded successfully');
    } catch (error) {
      console.error('Failed to load Spline scene:', error);
    }
  }

  ngOnDestroy(): void {
    // Clean up resources when component is destroyed
    if (this.app) {
      this.app.dispose();
    }
  }
}