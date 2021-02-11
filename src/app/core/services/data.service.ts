import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators'
import { menuItem } from '../models/menuItem';
import { Order } from '../models/order';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public snavState: boolean = false;
  private statePrintButton = new BehaviorSubject<boolean>(false);
  isShowPRNButton = this.statePrintButton.asObservable();
  //public formData: menuItem;
  constructor(private firestore: AngularFirestore, private _snackBar: MatSnackBar) { }

  changeStatePrnButton(res: boolean) {
    this.statePrintButton.next(res);
  }

  getMenuList() {
    return this.firestore.collection('menulist').snapshotChanges();
  }

  getOrders(user: User) {
    //return this.firestore.collection('orders').snapshotChanges();
    if (user.role == 'director' || user.role == 'restaurantAdmin' ) {
      return this.firestore.collection('orders').snapshotChanges();
    } else {
      return this.firestore.collection('orders', ref => ref.where('user', '==', user.uid))
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
    return this.firestore.collection('orders').doc(id).snapshotChanges();
    //return this.firestore.collection('orders').doc(id);
  }

  deleteOrder(id: string) {
    //this.firestore.collection('orders').doc(id).ref.collection('lines').parent.delete();
    //this.firestore.collection('orders').doc(id).delete();
    this.firestore.collection('orders').doc(id).collection('lines').get()
    .toPromise().then(
      snapshot => {snapshot.forEach( item => {
         item.ref.delete()
         }
       ),
       this.firestore.collection('orders').doc(id).delete(),
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

  async updateLineInOrderDatail (item: menuItem, orderId: string) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(item.id)
    try {
      await lineRef.update({
        price: item.price,
        qty: item.qty,
        name: item.name,
        discount: item.discount
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

  async deleteLineInOrderDatail (item: menuItem, orderId: string, user: User) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(item.id)
    try {
      await lineRef.delete()
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

  async moveToTrash() {

  }
}