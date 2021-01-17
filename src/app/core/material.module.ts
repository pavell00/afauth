import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule} from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

  @NgModule({
    imports: [
      MatListModule, MatSnackBarModule, MatSlideToggleModule,
      MatIconModule, MatButtonModule,
      MatFormFieldModule, MatTableModule, MatDialogModule,
      MatInputModule, MatSidenavModule, MatToolbarModule,
      MatSelectModule, MatCheckboxModule,
      MatExpansionModule
    ],
    exports: [
      MatSidenavModule,
      MatIconModule,
      MatToolbarModule,
      MatListModule,
      MatButtonModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      MatTableModule,
      MatSelectModule,
      MatSnackBarModule,
      MatSlideToggleModule,
      MatExpansionModule
    ],
    providers: [ 
      { provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}},
      { provide: MAT_DIALOG_DATA, useValue: [] }
    ]
  })


export class MaterialModule { }
