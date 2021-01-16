import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';
import { CanReadGuard } from './core/can-read.guard';

import { WorkComponent } from './components/work/work.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuItemCreateComponent } from './components/menuItem-create/menuItem-create.component';
import { OrderCreateComponent } from './components/order-create/order-create.components';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderListComponent } from './components/orders-list/orders-list.component';
import { PrintFormComponent } from './components/print-form/print-form.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent},
  { path: 'work', component: WorkComponent, canActivate: [CanReadGuard]},
  //{ path: 'work/orders-list', component: WorkComponent, canActivate: [CanReadGuard]},
  { path: 'work', component: WorkComponent, canActivate: [CanReadGuard], children: [
    { path: 'orders-list', component: OrderListComponent },
    { path: 'order-detail', component: OrderDetailComponent },
    { path: 'menu-list', component: MenuListComponent },
    { path: 'menuItem-create', component: MenuItemCreateComponent },
    { path: 'order-create', component: OrderCreateComponent },
    { path: 'print-form', component: PrintFormComponent },
  ] },
  //{ path: 'work/order-detail', component: OrderDetailComponent },
  { path: 'admin-page', component: AdminPageComponent, canActivate: [AdminGuard] },
  { path: 'user-profile', component: UserProfileComponent },
  { path: '',  redirectTo: '/welcome',  pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
