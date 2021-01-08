import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';
import { CanReadGuard } from './core/can-read.guard';

import { WorkComponent } from './components/work/work.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent},
  { path: 'work', component: WorkComponent, canActivate: [CanReadGuard] },
  { path: 'admin-page', component: AdminPageComponent, canActivate: [AdminGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: '',  redirectTo: '/welcome',  pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
