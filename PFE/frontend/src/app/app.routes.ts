import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthGuard } from './auth.guard';
import { AboutComponent } from './pages/about/about.component';
import { AllProjectsComponent } from './pages/all-projects/all-projects.component';
import { ProjectComponent } from './pages/project/project.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProductBacklogComponent } from './pages/product-backlog/product-backlog.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'about', component: AboutComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'all-projects', component: AllProjectsComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'create-project', component: CreateProjectComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'project/:id', component: ProjectComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'product-backlog', component: ProductBacklogComponent /*canActivate: [AuthGuard]*/ },
];
