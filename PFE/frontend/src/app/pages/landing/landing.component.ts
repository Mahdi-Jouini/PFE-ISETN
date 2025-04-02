import { Component } from '@angular/core';
import { ModalComponent } from "../../components/ui/modal/modal.component";

import { SplineViewerComponent } from '../../components/ui/spline-viewer/spline-viewer.component';
import { SignupComponent } from '../../components/signup/signup.component';
import { SigninComponent } from "../../components/signin/signin.component";

@Component({
  selector: 'app-landing',
  imports: [ModalComponent, SignupComponent, SigninComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  isSignUpOpen = false;
  isSignInOpen = false;

  openSignUp() {
    this.isSignUpOpen = true;
  }
  openSignIn() {
    this.isSignInOpen = true;
  }

  onSignUpClose() {
    this.isSignUpOpen = false;
  }
  onSignInClose() {
    this.isSignInOpen = false;
  }


  onSignUpConfirm() {
    this.isSignUpOpen = false;
  }
  onSignInConfirm() {
    this.isSignInOpen = false;
  }
}
