import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CoreModule } from './core/core.module';
import { MaterialModule } from './core/material.module';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from '@angular/fire/auth';

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import { AppComponent } from './app.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WorkComponent } from './components/work/work.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuItemCreateComponent } from './components/menuItem-create/menuItem-create.component';
import { OrderCreateComponent } from './components/order-create/order-create.components';
import { OrderDetailComponent, DialogEditOrderItem, DialogEditNote } from './components/order-detail/order-detail.component';
import { OrderListComponent, DialogEditNoteOrder } from './components/orders-list/orders-list.component';
import { PrintFormComponent } from './components/print-form/print-form.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TrashComponent } from './components/trash/trash.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    WorkComponent,
    WelcomeComponent,
    DialogEditOrderItem, DialogEditNote, DialogEditNoteOrder,
    AdminPageComponent, MenuListComponent, MenuItemCreateComponent,
    OrderCreateComponent, OrderDetailComponent, OrderListComponent,
    PrintFormComponent,
    TrashComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MaterialModule,
    CoreModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebaseConfig,
      () => 'afAuth',
      {
        enableFirestoreSync: true, // enable/disable autosync users with firestore
        toastMessageOnAuthSuccess: false, // whether to open/show a snackbar message on auth success - default : true
        toastMessageOnAuthError: false, // whether to open/show a snackbar message on auth error - default : true
        authGuardFallbackURL: '/welcome', // url for unauthenticated users - to use in combination with canActivate feature on a route
        authGuardLoggedInURL: '/work', // url for authenticated users - to use in combination with canActivate feature on a route
        passwordMaxLength: 60, // `min/max` input parameters in components should be within this range.
        passwordMinLength: 4, // Password length min/max in forms independently of each componenet min/max.
        // Same as password but for the name
        nameMaxLength: 50,
        nameMinLength: 2,
        // If set, sign-in/up form is not available until email has been verified.
        // Plus protected routes are still protected even though user is connected.
        guardProtectedRoutesUntilEmailIsVerified: false,
        enableEmailVerification: false, // default: true
      }),
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  entryComponents: [DialogEditOrderItem, DialogEditNote, DialogEditNoteOrder],
  bootstrap: [AppComponent]
})
export class AppModule { }
