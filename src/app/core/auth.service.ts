import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  isLoggedIn: boolean = false;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {

    //// Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })  
    )
            
  }

  ///// Login/Signup //////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    this.isLoggedIn = true;
    return this.afAuth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      }).catch(
        (error) => window.alert(error)
      )
  }

  signOut() {
    this.isLoggedIn = false;
    this.afAuth.signOut().then(
      () => {
        this.router.navigate(['welcome']);
        localStorage.removeItem('user');
      }
    ).catch(
      (error) => window.alert(error)
    )
   }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      roles: {
        subscriber: true
      }
    }
    localStorage.setItem('user', JSON.stringify(user));
    return userRef.set(data, { merge: true })
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true
      }
    }
    return false
  }

}
