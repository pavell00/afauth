import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Subscription } from 'rxjs';
import { Order } from '../../core/models/order';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  total_sum: number = 0;
  amount_orders: number = 0;
  amount_orders_done: number = 0;
  sum_orders_done: number = 0;
  amount_orders_inwork: number = 0;
  sum_orders_inwork: number = 0;
  startDt: Date;
  endDt: Date;
  orders: Order[] = [];
  private subscription: Subscription;

  constructor(private dataService: DataService, ) { }

  ngOnInit(): void {
    this.startDt = this.dataService.startDate;
    this.endDt = this.dataService.endDate;
    this.closeDatePicker();
  }

  closeDatePicker() {
    this.total_sum = 0;
    this.amount_orders = 0;
    this.amount_orders_done = 0;
    this.sum_orders_done = 0;
    this.amount_orders_inwork = 0;
    this.sum_orders_inwork = 0;
    //console.log(this.startDt, this.endDt)

    this.subscription = this.dataService.reports(this.startDt, this.endDt).subscribe(
      actionArray => {
        this.orders = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data() as Order
          }
        });
        this.orders.forEach(element => {
          if (element.isDone) {
            this.amount_orders_done++;
            this.sum_orders_done += element.sumToPay;
          } else {
            this.amount_orders_inwork++;
            this.sum_orders_inwork += element.sumToPay;
          };

        });
        this.total_sum = this.sum_orders_done + this.sum_orders_inwork;
        this.amount_orders = this.amount_orders_done + this.amount_orders_inwork;
      })
    
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
