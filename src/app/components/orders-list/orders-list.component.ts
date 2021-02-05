import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
//import * as copy from 'copy-to-clipboard';
//import copy from 'copy-to-clipboard';
import { Order } from '../../core/models/order';
import { menuItem } from '../../core/models/menuItem';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  user: User;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  header: string;
  strLine4: string;
  strLine5: string;
  maxLength: number;
  maxLengthFoodName: number;

  constructor(private dataService: DataService, private router : Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.displayedColumns = ['tableNo','OrderDate','sumOrder','discountOrder','Actions'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.authService.user$.subscribe(
      res => {
        this.user = res;
        this.dataService.getOrders(this.user).subscribe(actionArray => {
          this.orders = actionArray.map(item => {
            return {
              id: item.payload.doc.id,
              ...item.payload.doc.data() as Order
            }
          })
        });
      }
    )   

/*     this.dataService.getOrders().subscribe(actionArray => {
      this.orders = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as Order
        }
    }); */

/*     this.dataService.getOrders().subscribe(actionArray => {
      console.log(actionArray)
      this.orders = actionArray
      console.log(this.orders)
    }); */
  }

  onCreateOrder() {
    this.router.navigateByUrl('order-create');
  }

  editOrder(id: string) {
    let navigationExtras: NavigationExtras = { queryParams: {'orderid': id} };
    this.router.navigate(['work/order-detail'], navigationExtras);
  }

  buildLine(item: menuItem, itemName: string): string {
    let Sqty: number = item.qty * 1.0; //default value;
    let space_qty: string = '   ';
    let space_sum: string = '    ';
    if (item.qty >= 10 && item.qty <= 99) {space_qty = '  '}
    if (item.qty > 99) {space_qty = ' '};
    let qty = Sqty.toFixed(2);
    let sSum: number = (item.qty * item.price);
    let sum = sSum.toFixed(2);
    if (sSum >= 10 && item.qty <= 99) {space_sum = '   '}
    if (sSum >= 100 && sSum < 1000) {space_sum = '  '}
    if (sSum >= 1000 && sSum < 10000) {space_sum = ' '}
    if (sSum >= 10000) {space_sum = ''}
    return this.addSpace(itemName, this.maxLengthFoodName, 'af')+space_qty + qty + space_sum + sum+'\n';
  }

  addSpace(txt: string, needLenght: number, key: string) {
    if ((txt.length) < needLenght) {
      //console.log(txt + ' '.repeat(needLenght - (txt.length)))
      if (key == 'af') {
        return  txt + ' '.repeat(needLenght - (txt.length));
      } else {
        return  ' '.repeat(needLenght - (txt.length)) + txt;
      }
      
    }
    return txt;
  }

  deleteOrder(id: string) {
    this.dataService.deleteOrder(id)
  }

  printForm(order: Order) {
    let navigationExtras: NavigationExtras = { queryParams: {orderId: order.id}}
    /* let dateArr = order.orderDate.split(' ');
    let firstPart = dateArr[0] + '.' + new Date().getFullYear().toString();
    let finalyValue = firstPart.replace('/','.');
    let secontValue = dateArr[1]
    let timeArr = order.printTime.split(' ');
    let strTime = timeArr[1];
    let shortTime = strTime.slice(0, -3)
    
    //this.dataService.changeStatePrnButton(true);
    let navigationExtras: NavigationExtras = { queryParams: 
      { selectedMenu: JSON.stringify(this.selectedMenu), 
        orderSumToPay: this.orderSumToPay.toFixed(2),
        orderDate: this.orderDate,
        tableNo: this.tableNo,
        orderGuests: this.orderGuests,
        printTime: this.printTime,
        place: this.place,
        printed: this.printed,
        waiter: this.waiter,
        restaurant: restaurant,
        shortOrderDate: finalyValue,
        timeOpenTable: secontValue,
        shortPrintTime: shortTime,
        orderCheck: this.orderCheck
      },
    }; */
    this.router.navigate(['work/print-form'], navigationExtras);
    //this.router.navigateByUrl('/print-form', navigationExtras);
  }

}