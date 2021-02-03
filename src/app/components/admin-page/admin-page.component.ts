import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user';

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
export class AdminPageComponent implements OnInit {
  users: User[]=[];
  displayedColumns = ['displayName', 'email'];
  currentUserId: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUsers().subscribe(actionArray => {
      this.users = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as User
        } //as menuItem;
      })
    });
  }

  toggle(e: any, item: any) {
    //console.log(e.source.id, item, item.roles[e.source.id])
    //item.roles[e.source.id]=!item.roles[e.source.id]
    this.authService.changeUserRights(e.source.id, item.uid, item.roles[e.source.id])
  }
}
