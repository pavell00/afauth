import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators'
import { menuItem } from '../models/menuItem';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public snavState: boolean = false;
  private statePrintButton = new BehaviorSubject<boolean>(false);
  isShowPRNButton = this.statePrintButton.asObservable();
  //public formData: menuItem;
  constructor(private firestore: AngularFirestore, private _snackBar: MatSnackBar,
    private fns: AngularFireFunctions) { }

  deleteOrder_cfn(id: string): Observable<string> {
    const docid = { docid: id };
    return this.fns.httpsCallable('del_order')(docid)
  }

  changeStatePrnButton(res: boolean) {
    this.statePrintButton.next(res);
  }

  getMenuList() {
    return this.firestore.collection('menulist').snapshotChanges();
  }

  getOrders() {
    return this.firestore.collection('orders').snapshotChanges();
  }

  getParams() {
    return this.firestore.collection('prgparams').doc('2');
  }

  getSubCollection(id: string) {
    return this.firestore.collection('orders').doc(id).collection("lines").snapshotChanges();
  }
  
  getOrder(id: string) {
    //return this.firestore.collection('orders').doc(id).snapshotChanges();
    return this.firestore.collection('orders').doc(id);
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

  async deleteLineInOrderDatail (id: string, orderId: string) {
    var lineRef = this.firestore.collection('orders').doc(orderId).collection('lines').doc(id)
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
}