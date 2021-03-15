import { Component, OnDestroy, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { User, Role } from '../../core/models/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription, Observable, Subject, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminPageComponent implements OnInit, OnDestroy {
  users: User[] = [];
  roles: Role[] = [];
  res: any[] = [];
  displayedColumns = ['displayName', 'email','role','Act'];
  expandedElement: any;
  subscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.getUsers().subscribe(actionArray => {
      this.users = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as User
        } //as menuItem;
      })
    });
    this.subscription.add(
      this.authService.getRoles().subscribe(actionArray => {
        this.roles = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data() as Role
          } //as menuItem;
        })
      })
    );
  }

  public changeRole(role: string, roleRUS: string, user: User) {
    this.authService.setRole(role, roleRUS, user);
   }

  toggle(e: any, item: any) {
    //console.log(e.source.id, item, item.roles[e.source.id])
    //item.roles[e.source.id]=!item.roles[e.source.id]
    this.authService.changeUserRights(e.source.id, item.uid, item.roles[e.source.id])
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
