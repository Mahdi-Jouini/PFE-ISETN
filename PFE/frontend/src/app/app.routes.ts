import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthGuard } from './auth.guard';
import { AboutComponent } from './pages/about/about.component';
import { AllProjectsComponent } from './pages/all-projects/all-projects.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProductBacklogComponent } from './pages/product-backlog/product-backlog.component';
import { CreateProjectComponent } from './components/project-components/create-project/create-project.component';
import { ScrumBoardComponent } from './components/sprint-components/scrum-board/scrum-board.component';
import { ProjectChatComponent } from './pages/project-chat/project-chat.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, /*canActivate: [AuthGuard]*/ },
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
    { path: 'all-projects', component: AllProjectsComponent, canActivate: [AuthGuard] },
    { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuard] },
    { path: 'project/:id', component: ProjectComponent, canActivate: [AuthGuard] },
    { path: 'product-backlog/:id', component: ProductBacklogComponent, canActivate: [AuthGuard] },
    { path: 'scrum-board/:id', component: ScrumBoardComponent, canActivate: [AuthGuard] },
    { path: 'chat/:id', component: ProjectChatComponent },
];
