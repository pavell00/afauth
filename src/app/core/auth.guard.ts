import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, 
  RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap, map, take,switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router, private auth: AngularFireAuth) {
    // console.log('constructor AuthGuard');
    // this.authService.user$.subscribe(
    //   user => {
    //     if (user) {
    //       this.isLogged = true;
    //     } else {
    //       this.isLogged = false;
    //     }
    //   })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    //return this.checkLogin();
    //console.log('canActivate');
    //return this.isLogged;
      return this.authService.user$.pipe(
        map(res => {
          if (res) {
            return true
          } else {
            console.log('Access denided!');
            this.router.navigate(['/welcome']);
            return false
          }
        })
      )  
  }
  
  checkLogin(): boolean {
    console.log( this.isLogged);
     if (this.isLogged) { return true; }
    // Navigate to the login page with extras
    console.log('Access denided!');
    this.router.navigate(['/welcome']);
     return false;
  }
}
