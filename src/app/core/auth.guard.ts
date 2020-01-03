import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, 
  RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable,of } from 'rxjs';
import { tap, map, take,switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> 
    | Promise<boolean> | boolean  {

      if (this.authService.isLoggedIn) {
        return true;
      } else {
        // Navigate to the login page with extras
        console.log('Access denided!', this.authService.isLoggedIn);
        this.router.navigate(['/welcome']);
        return false;
      }

    //return this.authService.isLoggedIn
    //return this.checkLogin();
    // return this.isLogged;
  }
  
  // checkLogin(): boolean {
  //   // return this.isLogged;
  //   if (this.isLogged) {
  //     return true;
  //   } else {
  //     // Navigate to the login page with extras
  //     console.log('Access denided!', this.isLogged);
  //     this.router.navigate(['/welcome']);
  //     return false;
  //   }
  // }
}
