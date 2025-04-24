import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarItemComponent } from '../ui/nav-bar-item/nav-bar-item.component';
import { APIService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';



@Component({
  selector: 'app-navbar',
  imports: [NavBarItemComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isDarkMode = false;
  FileURL = "" ;
  UserName = "" ;
  UserEmail = "" ;

  constructor(private themeService: ThemeService, private apiService: APIService, private router: Router) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDark: boolean) => {
      this.isDarkMode = isDark;
      console.log('aaaaaaaaaaaaaaaaa' + this.isDarkMode)
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
  navigate(root : string){
    this.router.navigate(['/'+root]);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logOut(): void {
    this.apiService.logout();
  }
}