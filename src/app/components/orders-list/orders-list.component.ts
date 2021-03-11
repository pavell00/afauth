import { Component, OnInit, OnDestroy, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './format-datepicker';

import { Subscription } from 'rxjs';
import { Order } from '../../core/models/order';
import { menuItem } from '../../core/models/menuItem';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user';

export interface DialogData {
  id: string;
  tableNo: string;
  description: string;
}

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  viewProviders: [MatExpansionPanel],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class OrderListComponent implements OnInit, OnDestroy, AfterViewInit {
  orders: Order[] = [];
  user: User;
  isGetRight: boolean = false;
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  header: string;
  strLine4: string;
  strLine5: string;
  maxLength: number;
  maxLengthFoodName: number;
  newData: any;
  userName: string;
  private subscription: Subscription;
  sortDirection: string = 'asc';
  startDt: Date;
  endDt: Date;

  constructor(private dataService: DataService, private router : Router,
    private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.displayedColumns = ['tableNo','OrderDate','sumOrder','discountOrder','Actions','Description'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.subscription = this.authService.user$.subscribe(
      res => {
        this.user = res;
        this.userName = res.userName +" ("+ res.roleRUS + ")";
        this.isGetRight = this.authService.canRemoveMenuItem(this.user)
        this.subscription.add(
          this.dataService.getOrders(this.user).subscribe(actionArray => {
            this.orders = actionArray.map(item => {
              return {
                id: item.payload.doc.id,
                ...item.payload.doc.data() as Order
              }
            });
          })
        );
/*         this.subscription.add(
          this.dataService.getStartDate().subscribe(
            res => this.start = res
          )
        );
        this.subscription.add(
          this.dataService.getEndDate().subscribe(
            res => this.end = res
          )
        ); */
      });
      this.startDt = this.dataService.startDate;
      this.endDt = this.dataService.endDate;
  }

  ngAfterViewInit() { }

  closeDatePicker(start: string, end: string) {
    //console.log(this.startDt, this.endDt)
    let startYear = +start.substr(6, 4);
    let startMonth = +start.substr(3, 2)-1;
    let startDay = +start.substr(0, 2);
    let startDate = new Date(startYear, startMonth, startDay);

    let endYear = +end.substr(6, 4);
    let endMonth = +end.substr(3, 2)-1;
    let endDay = +end.substr(0, 2);
    let endDate = new Date(endYear, endMonth, endDay);

    this.dataService.setStartDate(this.startDt);
    this.dataService.setEndDate(this.endDt);

    this.subscription.add(
      this.dataService.getOrders(this.user).subscribe(actionArray => {
        this.orders = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data() as Order
          }
        });
      })
    )
  }

  sort(e: any) {
    //console.log(e.srcElement.innerText)
    if (this.sortDirection == 'asc' && e.srcElement.innerText == 'Дата / Время') {
      this.orders.sort((a, b) => (a.orderDate < b.orderDate ? -1 : 1));
      this.sortDirection = 'dsc'
    }
    if (this.sortDirection == 'dsc' && e.srcElement.innerText == 'Дата / Время') {
      this.orders.sort((a, b) => (a.orderDate > b.orderDate ? -1 : 1));
      this.sortDirection = 'asc'
    }
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

  deleteOrder(order: Order) {
    if (confirm("Вы уверенны что хотите удалить заказ?")) {
      this.dataService.deleteOrder(order, this.user.userName);
    }
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

  openDialogNote(item: Order): void {
    const dialogRef = this.dialog.open(DialogEditNoteOrder, {
      width: '250px',
      data: {id: item.id, tableNo: item.tableNo, description: item.description}
    });

    dialogRef.afterClosed().subscribe(result => {
      let orderId: string='';
       if (result) {
        this.newData = result;
        //console.log(this.newData);
        //refresh data in array
        for(let i = 0; i < this.orders.length; i++) {
          if(this.orders[i].id == this.newData.id) {
            this.orders[i].description = this.newData.description;
            orderId = this.orders[i].id
          }
        }
        //update data in DB ollection
        this.dataService.addDescriptionToOrder(this.newData.description, orderId)
      }
    });
  }

  unlockOrder(order: Order) {
    this.dataService.unlockOrder(order, this.user.userName);
  }

  test(order: Order) {
    this.dataService.test(order);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}

@Component({
  selector: 'dialog-note',
  templateUrl: './edit-dialogNote.html',
  styleUrls: ['./edit-dialogNote.css']
})
export class DialogEditNoteOrder{
  description: string;

  constructor(
    public dialogRefNote: MatDialogRef<DialogEditNoteOrder>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRefNote.close();
  }

}