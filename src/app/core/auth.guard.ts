import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, 
  RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take,switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe(
      user => {
        if (user) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }
      })
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> 
    | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkLogin();
    // return this.isLogged;
  }
  
  checkLogin(): boolean {
    // return this.isLogged;
     if (this.isLogged) { return true; }
    // Navigate to the login page with extras
    console.log('Access denided!');
    this.router.navigate(['/welcome']);
     return false;
  }
}
