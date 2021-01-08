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
import { WorkComponent, DialogOverviewExampleDialog } from './components/work/work.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    WorkComponent,
    WelcomeComponent,
    DialogOverviewExampleDialog,
    AdminPageComponent
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
        authGuardLoggedInURL: 'work', // url for authenticated users - to use in combination with canActivate feature on a route
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
    FormsModule
  ],
  providers: [],
  entryComponents: [DialogOverviewExampleDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
