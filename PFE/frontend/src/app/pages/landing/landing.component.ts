import { Component } from '@angular/core';
import { ModalComponent } from "../../components/ui/modal/modal.component";
import { SignupComponent } from '../../components/authentication-components/signup/signup.component';
import { SigninComponent } from "../../components/authentication-components/signin/signin.component";
import { AuroraTitleComponent } from "../../components/ui/aurora-title/aurora-title.component";
import { IconButtonComponent } from "../../components/ui/icon-button/icon-button.component";

@Component({
  selector: 'app-landing',
  imports: [SignupComponent, SigninComponent, AuroraTitleComponent, ModalComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
}
