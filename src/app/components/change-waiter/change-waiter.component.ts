import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'change-waitor',
  templateUrl: './change-waiter.component.html',
  styleUrls: ['./change-waiter.component.css']
})
export class ChangeWaiterComponent implements OnInit, OnDestroy {
  orderId: string;
  newWaiter: string;
  oldWaiter: string;
  subscription: Subscription;
  users: User[] = [];
  displayedColumns = ['displayName', 'role','Act'];

  constructor(private dataService: DataService, private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.route.queryParams.subscribe(params => {
        this.orderId = params["orderid"];
        this.oldWaiter = params["waiter"];
      });
    this.subscription.add(
      this.authService.getUsers().subscribe(actionArray => {
        this.users = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data() as User
          }
        });
      })
    );
  }

  changeWaitor(item: User) {
    this.dataService.changeWaitor(this.orderId , item.userName);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
