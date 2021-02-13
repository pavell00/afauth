import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  isLoggedIn: boolean = false;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private _snackBar: MatSnackBar) {

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
        //this.updateUserData(credential.user)
        localStorage.setItem('user', JSON.stringify(credential.user));
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
/*     const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      roles: {
        subscriber: true,
        editor: true
      }
    }
    localStorage.setItem('user', JSON.stringify(user));
    return userRef.set(data, { merge: true }) */
  }

  canWorkWithOrders(user: User): boolean {
    const allowed = ['restaurantAdmin', 'director', 'waitor']
    return this.checkAuthorization(user, allowed)
  }

  canRemoveMenuItem(user: User): boolean {
    const allowed = ['restaurantAdmin', 'director']
    return this.checkAuthorization(user, allowed)
  }

  canViewDeletedMenuItem(user: User): boolean {
    const allowed = ['director']
    return this.checkAuthorization(user, allowed)
  }

  canChangeMenu(user: User): boolean {
    const allowed = ['restaurantAdmin', 'director']
    return this.checkAuthorization(user, allowed)
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
      //if (user.roles[role]) {
      //  console.log(user.role, role)
      if (user.role == role) {
        return true
      }
    }
    return false
  }

  public getUsers(){
    return this.afs.collection('users').snapshotChanges();
  }

  public getRoles(){
    return this.afs.collection('roles').snapshotChanges();
  }

  changeUserRights(rightName: string, uid: string, flag: boolean) {
    //console.log(rightName, uid, flag)
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    switch (rightName) {
      case 'admin':
        return userRef.update({'roles.admin' : !flag})
        break;
      case 'editor':
        return userRef.update({'roles.editor' : !flag})
        break;
      case 'subscriber':
        return userRef.update({'roles.subscriber' : !flag})
        break; 
    }
  }

  async setRole(name: string, roleRUS: string, user: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    try {
      await userRef.set({
        role: name,
        roleRUS: roleRUS
      }, {merge:true})
      //this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error updating <user> collection: ", error);
    }
  }

  async setUserName(name: string, uid: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    try {
      await userRef.set({
        userName: name
      }, {merge:true})
      this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error updating <user> collection: ", error);
    }
  }

  openSnackBar(title: string, msg: string) {
    this._snackBar.open(title, msg, 
      {duration: 300, verticalPosition: 'top'})
  }
}
