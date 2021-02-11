import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AdminGuard } from './guards/admin.guard';
import { CanReadGuard } from './guards/can-read.guard';
import { DataService } from './services/data.service';
import { CanWorkWithOrdersGuard } from './guards/canWorkWithOrders.quards';
import { CanViewDeletedMenuItemGuard } from './guards/canViewDeletedMenuItem.guards';
import { CanRemoveMenuItemGuard } from './guards/canRemoveMenuItem.guards';
import { CanChangeMenuGuard } from './guards/canChangeMenuIguards';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AuthService, AdminGuard, CanReadGuard, DataService,
  CanWorkWithOrdersGuard, CanViewDeletedMenuItemGuard, CanRemoveMenuItemGuard,
  CanChangeMenuGuard
  ]
  //providers: [AuthService]
})
export class CoreModule { }