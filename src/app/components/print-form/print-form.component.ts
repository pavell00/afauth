import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
//import { timeStamp } from 'console';
import { menuItem } from '../../core/models/menuItem';
import { Params } from '../../core/models/params2';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.css']
})
export class PrintFormComponent implements OnInit {
  selectedMenu: menuItem[] = [];
  orderSumToPay: number;
  orderDate: string;
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

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedMenu = JSON.parse(params['selectedMenu']);
      this.orderSumToPay = params['orderSumToPay'];
      this.orderDate = params['orderDate'];
      this.orderNo = params['orderNo'];
      this.orderGuests = params['orderGuests'];
      this.place = params['place'];
      this.printed = params['printed'];
      this.waiter = params['waiter'];
      this.printTime = new Date().toLocaleString('ru').replace(',', '');//params['printTime'];
      this.restaurant = params['restaurant']
      this.shortOrderDate = params['shortOrderDate']
      this.timeOpenTable = params['timeOpenTable']
      this.shortPrintTime = params['shortPrintTime']
      this.orderCheck = params['orderCheck']
    });
    this.dataService.getParams().get().toPromise().then(
      param => {//console.log("params data:", doc.data())
/*         this.footerStr = param.data().footerStr;
        this.footerStr1 = param.data().footerStr1;
        this.footerStr2 = param.data().footerStr2; */
        this.currentParams = param.data() as Params
      })
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

}
