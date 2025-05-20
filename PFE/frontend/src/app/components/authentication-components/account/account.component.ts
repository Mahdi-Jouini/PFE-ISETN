import { Component } from '@angular/core';
import { DrawerComponent } from "../../ui/drawer/drawer.component";
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../services/authentication.service';
import { UserBannerComponent } from "../../user-components/user-banner/user-banner.component";
import { CommonModule } from '@angular/common';
import { APIService } from '../../../services/api.service';

@Component({
  selector: 'app-account',
  imports: [DrawerComponent, UserBannerComponent, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
    isDrawerOpen = false;
    drawerTitle = 'Account';
    user!: User

    constructor(private auth: AuthenticationService, private apiService: APIService) {}
    
    ngOnInit(): void {
        this.auth.getCurrentUser().subscribe(user => {
          if (user) {
              this.user = user
          } else {
              console.log('Unauthorized !')
          }
      });
    }

    logOut(): void {
    this.auth.signOut();
    }

    avatarUrl(fileUrl?: string): string {return this.apiService.GET_FILE(fileUrl)} 

    toggleDrawer(): void {
      this.isDrawerOpen = !this.isDrawerOpen;
    }

    onDrawerClosed(): void {
    this.isDrawerOpen = false;
    console.log('Drawer was closed');
  }
}
