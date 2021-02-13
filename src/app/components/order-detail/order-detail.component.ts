import { Component, OnInit, Inject, AfterContentInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router, NavigationExtras }     from '@angular/router';
import { Subscription, Observable, Subject } from 'rxjs';

import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Order } from '../../core/models/order';
import { User } from '../../core/models/user';
import { menuItem } from '../../core/models/menuItem';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

export interface DialogData {
  id: string;
  name: string;
  price: number;
  qty: number;
  discount: number;
  description: string;
}

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  viewProviders: [MatExpansionPanel]
})
export class OrderDetailComponent implements OnInit, AfterContentInit, OnDestroy {
  menulist : menuItem[] = [];
  filteredMenulist : menuItem[] = [];
  selectedMenu : menuItem[] = [];
  displayedColumns = ['add','name', 'price', 'qty', 'discount'];
  displayedCols = ['name', 'price', 'qty', 'sum', 'Actions','Description'];
  subscription: Subscription;
  isGetRight: boolean = false;

  currentOrder: Order;
  user: User;
  orderDate: string = new Date().toLocaleString();
  tableNo: string = '1';
  orderId: string;
  orderSum: number = 0.0;
  orderDiscount: number = 0.0;
  orderDiscountSum: number = 0.0;
  orderIsDone: boolean;
  orderSumToPay: number = 1.0;
  orderSumService: number = 1.0;
  orderGuests: number = 1;
  description: string = '';

  newData: any;
  printTime: string = '';
  place: string = '';
  printed: string = '';
  waiter: string = '';
  buttonState: boolean;
  done: boolean;
  doneInfo: string;
  orderCheck: number;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router,
    private firestore: AngularFirestore, public dialog: MatDialog, private auth: AuthService) {
  }
  
  ngOnInit() {
    this.subscription = this.dataService.getMenuList().subscribe(actionArray => {
      this.menulist = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as menuItem
        } //as menuItem;
      })
    });
    // Capture the order ID if available
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        this.orderId = params["orderid"];
      })
    )
    this.subscription.add(
    this.auth.user$.subscribe(
      res => {this.user= res;
        this.isGetRight = this.auth.canRemoveMenuItem(this.user)})
    )
    //get list items of order
    if (this.orderId) {
      this.subscription.add(
      this.dataService.getSubCollection(this.orderId).subscribe(actionArray => {
        this.selectedMenu = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as menuItem;
        });
      })
      )
    }
    // get order params
    if (this.orderId) {
      this.subscription.add(this.dataService.getOrder(this.orderId).subscribe(actionArray => {
        this.currentOrder = actionArray.payload.data() as Order;
        this.tableNo = this.currentOrder.tableNo;
        this.orderDate = this.currentOrder.OrderDate.toString();
        this.orderIsDone = this.currentOrder.isDone;
        this.orderSum = this.currentOrder.sumOrder;
        this.orderDiscount = this.currentOrder.discountOrder;
        this.orderDiscountSum = this.currentOrder.sumDiscount;
        this.orderSumService = this.currentOrder.sumService;
        this.orderSumToPay = this.currentOrder.sumToPay;
        this.orderGuests = this.currentOrder.guests;
        this.printTime = this.currentOrder.printTime;
        this.place = this.currentOrder.place;
        this.printed = this.currentOrder.printed;
        this.waiter = this.currentOrder.waiter;
        this.orderCheck = this.currentOrder.check;
        //--- for mat-slide-toggle 
        this.done = this.currentOrder.isDone;
        this.doneInfo = this.done ? 'Закрыт': 'Открыт';
      })
      )
    }
  }

  print(): void {
    let cntForPrint: number = 0;
    this.selectedMenu.forEach(item => {
      if (item.status !== 'InWork') {
        cntForPrint++;
      }
    })
    //check for non printed elemets in order (next part to print)
    if (!cntForPrint) {
      this.dataService.openSnackBar("Все позиции уже в работе!","Нечего печатать")
      return
    }

    let printContents: string, popupWin: any;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
    this.selectedMenu.forEach(item => {
      if (item.status !== 'InWork') {
        this.dataService.setStatusInOrderDatailToInWork(item, this.orderId)
      }
    });
    
  }

  printForm(e: any) {}

  onSave() {
    //update existing document
    if (this.orderId) {
      if (this.selectedMenu) this.caclSumOrder();
      this.firestore.collection('orders').doc(this.orderId).update({
        //id: this.orderId,
        OrderDate: this.orderDate, 
        tableNo: this.tableNo,
        sumOrder: this.orderSum,
        discountOrder: this.orderDiscount,
        sumDiscount: this.orderDiscountSum,
        sumService: this.orderSumService,
        sumToPay: this.orderSumToPay,
        guests: this.orderGuests,
        printTime: this.printTime,
        place: this.place,
        printed: this.printed,
        waiter: this.waiter,
        user: this.user.uid
        //isDone: true, this.orderSumToPay = this.orderSumService;
      });
      this.dataService.openSnackBar('Сохранение зказа...', 'завершено!');
    }
  }

  caclSumOrder() {
      this.orderSum = 0.0;
      let ssum: number = 0.0;
      this.selectedMenu.forEach(
        item => {
          ssum += Math.round(item.price * item.qty);
        }
      )
      this.orderSum = ssum;
      // если указан процент скдки на счет - вычиляем сумму скидки
      if (this.orderDiscount) {
        this.orderDiscountSum = Math.round(this.orderSum * (this.orderDiscount /100.0));
      }
      this.orderSumToPay = (this.orderSum - this.orderDiscountSum + this.orderSumService) * 1;
  }

  ngAfterContentInit() {
    if (this.orderId) {
      //this.getOrderItems2();
      //this.fillOrderData();
    } 
  }

  storeOrderItems(id: string) {
    //clear data in subcollection
    //console.log(this.selectedMenu)
    //this.firestore.collection('orders').doc(id).collection('lines').get().toPromise().then(
    //  query => { console.log(query.size);
    //    if (query.size > 0) {
          this.firestore.collection('orders').doc(id).collection('lines').get().toPromise().then(
          snapshot => {snapshot.forEach( d => {
           //.docs.forEach( d => {
              d.ref.delete()
            }
          )}
        )
     // }
    //})
    //console.log(this.selectedMenu)
    //add item to subcollection
    let i=1;
    this.selectedMenu.forEach(
      item => {
        //console.log(item);
        this.firestore.collection('orders').doc(id).collection('lines').add({
          line_no: i,
          name: item.name,
          price: item.price,
          qty: item.qty,
          discount: item.discount
        })
        i++;
      }
    )

  }

  getOrderItems2() {
      if (this.orderId) {
      this.dataService.getSubCollection(this.orderId).subscribe(actionArray => {
        this.selectedMenu = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as menuItem;
        });
      });
    }
  }

  fillOrderData() {
    console.log(this.orderId)
    if (this.orderId) {
        //let docRef = this.firestore.collection('orders').doc(this.orderId);
        this.dataService.getOrder(this.orderId).toPromise().then(
          doc => {
            //console.log("Document data:", doc.data())
/*          this.tableNo = doc.data().tableNo;
            this.orderDate = doc.data().OrderDate;
            this.orderIsDone = doc.data().isDone;
            this.orderSum = doc.data().sumOrder;
            this.orderDiscount = doc.data().discountOrder;
            this.orderDiscountSum = doc.data().sumDiscount;
            this.orderSumService = doc.data().sumService;
            this.orderSumToPay = doc.data().sumToPay;
            this.orderGuests = doc.data().guests;
            this.printTime = doc.data().printTime;
            this.place = doc.data().place;
            this.printed = doc.data().printed;
            this.waiter = doc.data().waiter;
            this.done = doc.data().isDone;
            this.doneInfo = this.done ? 'Закрыт': 'Открыт';
            this.orderCheck = doc.data().check; */
             this.currentOrder = doc as Order
             console.log(this.currentOrder)
/*            this.tableNo = this.currentOrder.tableNo
            this.orderDate = this.currentOrder.toString()
            this.orderIsDone = this.currentOrder.isDone
            this.orderSum = this.currentOrder.sumOrder
            this.orderDiscount = this.currentOrder.discountOrder
            this.orderDiscountSum = this.currentOrder.sumDiscount
            this.orderSumService = this.currentOrder.sumService
            this.orderSumToPay = this.currentOrder.sumToPay
            this.orderGuests = this.currentOrder.guests
            this.printTime = this.currentOrder.printTime
            this.place = this.currentOrder.place
            this.printed = this.currentOrder.printed
            this.waiter = this.currentOrder.waiter
            this.orderCheck = this.currentOrder.check */
            //--- for mat-slide-toggle 
            this.done = this.currentOrder.isDone;
            this.doneInfo = this.done ? 'Закрыт': 'Открыт';
          }
        )
      }
  }

  onAdd(item: menuItem) {
    //добавляем элемент через пересодание массива 
    //т.к. два mat-table не хотят сами авто-рефрешится 
    //когда живут на одной странице
    this.selectedMenu.push(item);
    let cloned = [...this.selectedMenu];
    this.selectedMenu = cloned;
    //console.log(this.selectedMenu)
    //recalc doc sum
    this.caclSumOrder()
    //insert row of menuItem to DB
    this.dataService.addLineInOrderDatail(item, this.orderId)
    this.dataService.updateRecalculatedOrderSums (this.orderId, this.orderSum, this.orderSumToPay)
  }

  onDelete(item: menuItem) {
    //удаляем элемент через пересодание массива 
    //т.к. два mat-table не хотят сами авто-рефрешится 
    //когда живут на одной странице
    //console.log(id, this.selectedMenu)
    if (confirm("Вы уверенны что хотите удалить блюдо?")) {
      for(let i = 0; i < this.selectedMenu.length; i++) {
        if(this.selectedMenu[i].id == item.id) {
          this.selectedMenu.splice(i, 1);
        }
      }
      let cloned = [...this.selectedMenu];
      this.selectedMenu = cloned;
      //recalc doc sum
      this.caclSumOrder()
      //delete row of menuItem from DB
      this.dataService.deleteLineInOrderDatail(item, this.orderId, this.user.userName,
         this.tableNo, this.orderDate);
      this.dataService.updateRecalculatedOrderSums (this.orderId, this.orderSum, 
        this.orderSumToPay);
    }
  }

  changeQty(item: menuItem, val: number) {
    for(let i = 0; i < this.selectedMenu.length; i++) {
      if(this.selectedMenu[i].id == item.id) {
        this.selectedMenu[i].qty = +item.qty + val;
      }
    }
    //recalc doc sum
    this.caclSumOrder()
    this.dataService.updateQtyInLineInOrderDatail(item, this.orderId)
    this.dataService.updateRecalculatedOrderSums (this.orderId, this.orderSum, this.orderSumToPay)
  }

  applyFilter(filterValue: string) {
    //this.orderId.pipe(map(m => console.log(m)))
    this.filteredMenulist = this.menulist.filter(v => v.name.toLowerCase().includes(filterValue.trim().toLowerCase()));
  }

  openDialog(item: menuItem): void {
    const dialogRef = this.dialog.open(DialogEditOrderItem, {
      width: '250px',
      data: {id: item.id, name: item.name, price: item.price, qty: item.qty, discount: item.discount}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      if (result) {
        this.newData = result;
        //console.log(this.newData);
        //refresh data in array
        for(let i = 0; i < this.selectedMenu.length; i++) {
          if(this.selectedMenu[i].id == this.newData.id) {
            this.selectedMenu[i].price = this.newData.price;
            this.selectedMenu[i].qty = this.newData.qty;
            this.selectedMenu[i].discount = this.newData.discount;
          }
        }
        //update data in DB subCollection
        //console.log(this.orderId)
        this.dataService.updateLineInOrderDatail(this.newData, this.orderId)
      }
    });
  }

  openDialogNote(item: menuItem): void {
    const dialogRef = this.dialog.open(DialogEditNote, {
      width: '250px',
      data: {id: item.id, name: item.name, description: item.description}
    });

    dialogRef.afterClosed().subscribe(result => {
       if (result) {
        this.newData = result;
        //console.log(this.newData);
        //refresh data in array
        for(let i = 0; i < this.selectedMenu.length; i++) {
          if(this.selectedMenu[i].id == this.newData.id) {
            this.selectedMenu[i].description = this.newData.description;
          }
        }
        //update data in DB subCollection
        //console.log(this.orderId)
        this.dataService.addDescriptionInOrderDatail(this.newData, this.orderId)
      }
    });
  }

  public toggle(event: MatSlideToggleChange) {
    //console.log('toggle', event.checked);
    this.dataService.changeDoneStatus(this.orderId, event.checked);
    switch (this.doneInfo ) {
      case 'Закрыт':
        this.doneInfo = 'Открыт';
        break;
      case 'Открыт':
        this.doneInfo = 'Закрыт';
        break;    
      default:
        this.doneInfo = 'Закрыт';
        break;
    }
    //this.useDefault = event.checked;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './edit-dialog.html',
  styleUrls: ['./edit-dialog.css']
})
export class DialogEditOrderItem {
  price: number = 0
  qty: number = 0
  discount: number = 0

  constructor(
    public dialogRef: MatDialogRef<DialogEditOrderItem>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-note',
  templateUrl: './edit-dialogNote.html',
  styleUrls: ['./edit-dialogNote.css']
})
export class DialogEditNote{
  description: string;

  constructor(
    public dialogRefNote: MatDialogRef<DialogEditNote>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRefNote.close();
  }

}