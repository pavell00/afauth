import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

  @NgModule({
    exports: [
      MatSidenavModule,
      MatIconModule,
      MatToolbarModule,
      MatListModule,
      MatButtonModule,
    ]
  })


export class MaterialModule { }
