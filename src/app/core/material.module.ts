import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

  @NgModule({
    exports: [
      MatSidenavModule,
      MatIconModule,
      MatToolbarModule,
      MatListModule,
      MatButtonModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule
    ],
    providers: [ 
      { provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}},
      { provide: MAT_DIALOG_DATA, useValue: [] }
    ]
  })


export class MaterialModule { }
