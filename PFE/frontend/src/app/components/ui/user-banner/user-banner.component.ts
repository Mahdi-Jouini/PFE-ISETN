import { Component, Input } from '@angular/core';
import { APIService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-user-banner',
  imports: [],
  templateUrl: './user-banner.component.html',
  styleUrl: './user-banner.component.css'
})
export class UserBannerComponent {
  @Input() user! : User ;

  constructor(private apiService: APIService) {}

  avatarUrl(fileUrl: string): string {return this.apiService.GET_FILE(fileUrl)} 
}
