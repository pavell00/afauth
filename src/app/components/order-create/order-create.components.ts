import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../../core/models/order';
import { User } from '../../core/models/user';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'order-create',
    templateUrl: './order-create.components.html',
    styleUrls: ['./order-create.components.css']
})
export class OrderCreateComponent implements OnInit {
    newOrder: Order;
    user: User;
    orderDate: Date;// = new Date().toLocaleString('ru');
    orderNo: number = 1;
    orderSum: number = 0;
    orderDiscount: number = 0;
    sumDiscount: number = 0;
    orderIsDone: boolean = false;
    orderGuests: number = 1;
    orderPrintTime: string = new Date().toLocaleString('ru').replace(',', '');
    orderCheck: number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    orderSumService: number = 0;
    place: string = 'Зал';
    waiter: string = 'Кукайло Татьяна';
    printed: string= 'Кукайло Татьяна';

    constructor(private dataService: DataService, private auth: AuthService,
    private firestore: AngularFirestore) { }

    ngOnInit(): void {
      this.auth.user$.subscribe(
        res => {this.user= res;
        this.waiter = this.printed = res.userName;
      }
      );
      let d = new Date();
      let day = d.getDate();
      /*let dd: string = (d.getDay() + 1).toString();
      let mm: string = (d.getMonth() + 1).toString();
      if (mm.length == 1) {mm = '0'+mm;}
      if (dd.length == 1) {dd = '0'+dd;}
      let date: string = dd+'/'+mm+' '+d.getHours()+':'+d.getMinutes();*/
      let date: string = 
        (day<10?'0':'') + (day) +'/'+ 
        ((d.getMonth()+1)<10?'0':'') + (d.getMonth()+1) +' '+ 
        (d.getHours()<10?'0':'') + d.getHours() + ':' +
        (d.getMinutes()<10?'0':'') + d.getMinutes() 
      this.orderDate = d // date;
    }

    onSave() {
      //add new document
        let res = this.firestore.collection('orders').add({
        orderDate: this.orderDate, 
        tableNo: this.orderNo.toString(),
        sumOrder: this.orderSum,
        discountOrder: this.orderDiscount,
        sumDiscount: this.sumDiscount,
        sumService: this.orderSumService,
        isDone: false,
        guests: this.orderGuests,
        check: this.orderCheck,
        printTime: this.orderPrintTime,
        place: this.place,
        printed: this.printed,
        waiter: this.waiter,
        sumToPay: this.orderSum + this.orderSumService,
        user: this.user.uid
      }).then(
        (w) => {
          //this.orderId = w.id;
          //this.storeOrderItems(w.id);
          //console.log(w.id)
          //this.toastr.success('Заказ создан', 'EMP. Register');
          this.dataService.openSnackBar('Сохраниение зказа...', 'завершено!');
          }
      )
    }

}