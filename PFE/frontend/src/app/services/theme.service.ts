// theme.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkMode.asObservable();
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.setDarkMode(savedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setDarkMode(prefersDark);
      }
    }
  }

  toggleTheme(): void {
    this.darkMode.next(!this.darkMode.value);
    this.updateTheme();
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);
    this.updateTheme();
  }

  private updateTheme(): void {
    const isDark = this.darkMode.value;
    
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-theme', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }
}