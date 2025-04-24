import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SideBarComponent } from "./components/ui/side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
