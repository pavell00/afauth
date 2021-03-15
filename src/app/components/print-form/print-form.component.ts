import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { Order } from 'src/app/core/models/order';
//import { timeStamp } from 'console';
import { menuItem } from '../../core/models/menuItem';
import { Params } from '../../core/models/params2';
import { DataService } from '../../core/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.css']
})
export class PrintFormComponent implements OnInit, OnDestroy {
  selectedMenu: menuItem[] = [];
  currentOrder: Order;
  orderId: string;
  orderSumToPay: number;
  orderDate: Date;
  orderNo: string;
  orderGuests: number;
  place: string;
  printed: string;
  waiter: string = '';
  printTime: string = '';
  footerStr: string = '';
  footerStr1: string = '';
  footerStr2: string = '';
  restaurant: string = '';
  shortOrderDate : string = '';
  timeOpenTable: string = '';
  shortPrintTime: string = '';
  orderCheck: string = '';
  currentParams: Params;
  printTime2: Date;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
      this.subscription.add(this.dataService.getOrder(params['orderId']).subscribe(
        actionArray => {
          this.currentOrder = actionArray as Order;
          let dateArr = this.currentOrder.orderDate.toDateString().split(' ');
          let firstPart = dateArr[0] + '.' + new Date().getFullYear().toString();
          let finalyValue = firstPart.replace('/','.');
          let secontValue = dateArr[1]
          let timeArr = this.currentOrder.printTime.split(' ');
          let strTime = timeArr[1];
          let shortTime = strTime.slice(0, -3)
          //this.selectedMenu = JSON.parse(params['selectedMenu']);
          this.orderSumToPay = this.currentOrder.sumToPay;
          this.orderDate = this.currentOrder.orderDate;
          this.orderNo = this.currentOrder.check.toString();
          this.orderGuests = this.currentOrder.guests;
          this.place = this.currentOrder.place;
          this.printed = this.currentOrder.printed;
          this.waiter = this.currentOrder.waiter;
          this.printTime = new Date().toLocaleString('ru').replace(',', '');//params['printTime'];
          //this.restaurant = res.restaurant;
           this.shortOrderDate = finalyValue;
          this.timeOpenTable = secontValue;
          //this.shortPrintTime = shortTime;
          this.printTime2 = new Date()
          this.orderCheck = this.currentOrder.check.toString(); 
        })
      )
    });
    this.dataService.getParams().get().toPromise().then(
      param => {//console.log("params data:", doc.data())
/*         this.footerStr = param.data().footerStr;
        this.footerStr1 = param.data().footerStr1;
        this.footerStr2 = param.data().footerStr2; */
      this.currentParams = param.data() as Params
    });
    //get list items of order
    if (this.orderId) {
      this.subscription.add(this.dataService.getSubCollection(this.orderId).subscribe(actionArray => {
        this.selectedMenu = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as menuItem;
        });
      })
      )
    }
  }

  print() {
    if (this.dataService.snavState) {
      
    }
    window.print();
    //console.log(document.getElementById("printable").innerHTML)
/*     var newWindow = window.open();
    newWindow.document.write(document.getElementById("printable").innerHTML);
    newWindow.print();  */
/*     var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById("printable").innerHTML;
    document.body.innerHTML = printcontent;
    window.print();
    document.body.innerHTML = restorepage; */
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
