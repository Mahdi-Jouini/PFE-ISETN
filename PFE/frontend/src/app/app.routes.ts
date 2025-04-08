import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent, /*canActivate: [AuthGuard]*/ },
];
