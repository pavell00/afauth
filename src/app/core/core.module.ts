import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AdminGuard } from './admin.guard';
import { CanReadGuard } from './can-read.guard';
import { DataService } from './services/data.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AuthService, AdminGuard, CanReadGuard, DataService]
  //providers: [AuthService]
})
export class CoreModule { }