import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  toggleTheme() {
    throw new Error('Method not implemented.');
  }
  isDarkMode$: any;

  constructor() { }
}
