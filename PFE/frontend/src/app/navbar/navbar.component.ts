import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { APIService } from '../services/api.service';


@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isDarkMode = false;
  FileURL = "" ;
  UserName = "" ;
  UserEmail = "" ;

  constructor(private themeService: ThemeService, private apiService: APIService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDark: boolean) => {
      this.isDarkMode = isDark;
    });

    this.apiService.GET("/Auth/me", "").subscribe({
      next: (response: any) => {
        console.log(response);
        this.FileURL = this.apiService.GET_FILE(response.avatar);
        this.UserName = response.firstName + " "+ response.lastName;
        this.UserEmail = response.emailAddress
        },
        error: (error: any) => {
          console.error(error);
        }
    })

    
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logOut(): void {
    this.apiService.logout();
  }
}