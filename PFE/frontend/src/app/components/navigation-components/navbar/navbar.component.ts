import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { NotificationBadgeComponent } from "../../notification-components/notification-badge/notification-badge.component";
import { AccountComponent } from "../../authentication-components/account/account.component";



@Component({
  selector: 'app-navbar',
  imports: [ CommonModule, NotificationBadgeComponent, AccountComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isDarkMode = false;
  user!: User

  constructor(private themeService: ThemeService, private router: Router, private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((isDark: boolean) => {
      this.isDarkMode = isDark;
    }) 
  }
  navigate(root : string){
    this.router.navigate(['/'+root]);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

}