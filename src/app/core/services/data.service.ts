import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map, tap } from 'rxjs/operators'
import { menuItem } from '../models/menuItem';
import { Order } from '../models/order';
import { User } from '../models/user';
import { convertTimestampsPipe } from '../../../../../afauth/node_modules/convert-firebase-timestamp';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public snavState: boolean = false;
  private statePrintButton = new BehaviorSubject<boolean>(false);
  isShowPRNButton = this.statePrintButton.asObservable();
/*   startDate = new BehaviorSubject<Date>(new Date);
  endDate = new BehaviorSubject<Date>(new Date); */
  startDate: Date =  new Date();
  endDate: Date = new Date();
  //public formData: menuItem;
  constructor(private firestore: AngularFirestore, private _snackBar: MatSnackBar) {
    this.startDate.setHours(0);
    this.startDate.setMinutes(0);
    this.startDate.setSeconds(0);

    this.endDate.setHours(23);
    this.endDate.setMinutes(59);
    this.endDate.setSeconds(59);
  }

  changeStatePrnButton(res: boolean) {
    this.statePrintButton.next(res);
  }

  setStartDate(d: Date) {this.startDate = d}
  setEndDate(d: Date) {this.endDate = this.addDays(d, 1)}

  getMenuList() {
    return this.firestore.collection('menulist').snapshotChanges();
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    date.setSeconds(date.getSeconds() - 1);
    return date;
  }

  getOrders(user: User) {
    //return this.firestore.collection('orders').snapshotChanges();
    //console.log(this.startDate, this.endDate)
    if (user.role == 'director' || user.role == 'restaurantAdmin') {
      //return this.firestore.collection('orders', ref => ref.orderBy('orderDate', 'desc')).snapshotChanges();
      return this.firestore.collection('orders', ref => ref
      .where('orderDate', '>=', this.startDate)
      .where('orderDate', '<', this.endDate)
      )
      .snapshotChanges();
    } else {
      return this.firestore.collection('orders', ref => 
      //ref.where('user', '==', user.uid)//.orderBy('orderDate')//.where('isDone', '==', 'false')
      ref.where('user', '==', user.uid).where('isDone', '==', false).orderBy('orderDate','desc')
      )
      .snapshotChanges()
    }
/*    return this.firestore.collection('orders', ref => ref.where('user', '==', user.uid))
    .snapshotChanges()
       .get()
      .pipe(
        filter(ref => !ref.empty)
        //,map(ref => ref.docs[1].data() as Order)
        ,map(ref => {
          const orders: Order[] = [];
          return ref.docs[0].data()
        })
      ) */
  }

  getParams() {
    return this.firestore.collection('prgparams').doc('2');
  }

  getSubCollection(id: string) {
    return this.firestore.collection('orders').doc(id).collection("lines").snapshotChanges();
  }
  
  getOrder(id: string) {
    return this.firestore.collection('orders').doc(id).snapshotChanges().pipe(
      map(doc => doc.payload.data()),
      convertTimestampsPipe()
    );
    //return this.firestore.collection('orders').doc(id);
  }

  deleteOrder(order: Order, userName: string) {
    //this.firestore.collection('orders').doc(id).ref.collection('lines').parent.delete();
    //this.firestore.collection('orders').doc(id).delete();
    this.firestore.collection('orders').doc(order.id).collection('lines').get()
    .toPromise().then(
      snapshot => {snapshot.forEach( item => {
         item.ref.delete()
         }
       );
       let element : menuItem = {
        name : 'весь заказ',
        qty : 1,
        price : order.sumToPay
       }
       this.moveToTrash(element, userName, order.tableNo, order.orderDate)
       this.firestore.collection('orders').doc(order.id).delete(),
       this.openSnackBar('Удаление заказа...', 'завершено!')
      }
    )

  }

  async changeDoneStatus (id: string, status: boolean) {
    var docRef = this.firestore.collection("orders").doc(id);
    try {
      await docRef.set({
        isDone: status
      },{merge:true});
      let prefix: string;
      if (status) {
        prefix = 'Закрытие заказа...';
      }
      else {
        prefix = 'Открытие заказа...';
      }
      this.openSnackBar(prefix, 'завершено...');
    }
    catch (error) {
      console.error("Error updating status document: ", error);
    }

  }

  openSnackBar(title: string, msg: string) {
    this._snackBar.open(title, msg, 
      {duration: 300, verticalPosition: 'top'})
  }

  async updateLineInOrderDatail (item: menuItem, orderId: string, 
    old_qty: number, old_price: number, userName: string, 
    tableNo: string, orderDate: Date) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(item.id)
    let element: menuItem = {
      name: 'коррек. '+item.name,
      price: old_price,
      qty: old_qty
    }
    try {
      await this.moveToTrash(element, userName, tableNo, orderDate);
      await lineRef.update({
        price: item.price,
        qty: item.qty,
        name: item.name,
        discount: item.discount,
        old_qty,
        old_price
      })
      this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error updating row in <line> collection: ", error);
    }
  }

  async addDescriptionInOrderDatail (item: menuItem, orderId: string) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(item.id)
    try {
      await lineRef.set({
        description: item.description,
      }, {merge: true})
      this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error adding description in <line> collection: ", error);
    }
  }

  async updateQtyInLineInOrderDatail (item: menuItem, orderId: string) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(item.id)
    try {
      await lineRef.set({
        qty: item.qty
      },{merge:true})
      this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error updating row in <line> collection: ", error);
    }
  }

  async addLineInOrderDatail (item: menuItem, orderId: string) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines')
    try {
      await lineRef.add({
        line_no: 0,
        name: item.name,
        price: item.price,
        qty: item.qty,
        discount: item.discount
      });
      this.openSnackBar('Добавление элемента', 'завершено...');
    } catch (error) {
      console.error("Error adding new row to <line> collection: ", error);
    }
  }

  async deleteLineInOrderDatail (item: menuItem, orderId: string, userName: string, 
    tableNo: string, orderDate: Date, logToTrash: boolean) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(item.id)
    try {
      if (logToTrash) {
        await this.moveToTrash(item, userName, tableNo, orderDate);
      }
      await lineRef.delete();
      this.openSnackBar('Удаление элемента', 'завершено...');
    } catch (error) {
      console.error("Error deleting line menuItem : ", error);
    }
  }

  async updateRecalculatedOrderSums (orderId: string, orderSum: number, orderSumToPay: number) {
    var lineRef = this.firestore.collection('orders').doc(orderId)
    try {
      await lineRef.set({
        sumOrder: orderSum,
        sumToPay: orderSumToPay
      },{merge:true})
      //this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error updating <orders> collection: ", error);
    }
  }

  async setStatusInOrderDatailToInWork (item: menuItem, orderId: string) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(item.id)
    try {
      await lineRef.set({
        status: 'InWork',
      }, {merge: true})
      //this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error chanching status in <line> collection: ", error);
    } 
  }

  async addDescriptionToOrder(description: string, orderId: string) {
    var lineRef = this.firestore.collection('orders').doc(orderId)
    try {
      await lineRef.set({
        description: description,
      }, {merge: true})
      this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error adding description to Order: ", error);
    } 
  }

  async unlockOrder(order: Order, userName: string) {
    var lineRef = this.firestore.collection('orders').doc(order.id)
    let element : menuItem = {
      name : 'разблокировка',
      qty : 1,
      price : order.sumToPay
     }
    try {
      await this.moveToTrash(element, userName, order.tableNo, order.orderDate);
      await lineRef.set({
        isDone: false,
      }, {merge: true})
      this.openSnackBar('Обновление элемента', 'завершено...');
    } catch (error) {
      console.error("Error opening Order status: ", error);
    } 
  }

  async moveToTrash(item: menuItem, userName: string, 
    tableNo: string, orderDate: Date) {
      let res = this.firestore.collection('trash').add({
        orderDate: orderDate,
        tableNo: tableNo,
        name: item.name,
        qty: item.qty,
        price: item.price,
        sumItem: item.price * item.qty,
        user: userName,
        actDate: new Date()
      }).then(
        (w) => {
          //this.dataService.openSnackBar('Сохраниение зказа...', 'завершено!');
          }
      )
    }

  getTrash() {
    return this.firestore.collection('trash', ref => ref.orderBy('actDate', 'desc')).snapshotChanges();
  }

  async deleteItemFromTrash (id: string) {
    var lineRef = this.firestore.collection('trash').doc(id)
    try {
      await lineRef.delete();
      this.openSnackBar('Удаление элемента', 'завершено...');
    } catch (error) {
      console.error("Error deleting line trash : ", error);
    }
  }
}