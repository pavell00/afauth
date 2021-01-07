import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class CanReadGuard implements CanActivate {

  constructor(private auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
      return this.auth.user$.pipe(
        take(1),
        map(user => user && this.auth.canRead(user) ? true : false),
        tap(canView => {
          if (!canView) {
            console.error('Access denied. Must have permission to view content')
          }
        })
      );
  }
  
}
