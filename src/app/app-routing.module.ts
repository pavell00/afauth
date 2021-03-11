import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { CanReadGuard } from './core/guards/can-read.guard';
import { CanWorkWithOrdersGuard } from './core/guards/canWorkWithOrders.quards';
import { CanViewDeletedMenuItemGuard } from './core/guards/canViewDeletedMenuItem.guards';
import { CanRemoveMenuItemGuard } from './core/guards/canRemoveMenuItem.guards';

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
import { TrashComponent } from './components/trash/trash.component';
import { CanChangeMenuGuard } from './core/guards/canChangeMenu.guards';
import { SignInUpComponent } from './components/sign-in-up/sign-in-up.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: 'sign-in-up', component: SignInUpComponent},
  { path: 'welcome', component: WelcomeComponent},
  { path: 'work', component: WorkComponent, canActivate: [CanWorkWithOrdersGuard]},
  //{ path: 'work/orders-list', component: WorkComponent, canActivate: [CanReadGuard]},
  { path: 'work', component: WorkComponent, canActivate: [CanWorkWithOrdersGuard], children: [
    { path: 'orders-list', component: OrderListComponent },
    { path: 'order-detail', component: OrderDetailComponent },
    { path: 'menu-list', component: MenuListComponent, canActivate: [CanChangeMenuGuard] },
    { path: 'menuItem-create', component: MenuItemCreateComponent, canActivate: [CanChangeMenuGuard] },
    { path: 'order-create', component: OrderCreateComponent },
    { path: 'print-form', component: PrintFormComponent },
  ] },
  //{ path: 'work/order-detail', component: OrderDetailComponent },
  { path: 'admin-page', component: AdminPageComponent, canActivate: [CanViewDeletedMenuItemGuard] },
  { path: 'trash', component: TrashComponent, canActivate: [CanViewDeletedMenuItemGuard] },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'repors', component: ReportsComponent, canActivate: [CanViewDeletedMenuItemGuard] },
  { path: '',  redirectTo: '/sign-in-up',  pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
