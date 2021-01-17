import { Component, OnInit } from '@angular/core';
import { menuItem } from '../../core/models/menuItem';
import { DataService } from '../../core/services/data.service';
import { Router, NavigationExtras } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  menulist : menuItem[] = [];
  displayedColumns = ['name', 'price', 'qty', 'Del'];
  menuName: string;
  menuQty: number;
  menuPrice: number;
  menuDisc: number;
  
  constructor(private dataService: DataService, private router : Router,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    this.dataService.getMenuList().subscribe(actionArray => {
      this.menulist = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as menuItem
        } //as menuItem;
      })
    });
  }

  createMenuItem() {
    //menuItem-create
    this.router.navigateByUrl('work/menuItem-create');
  }

  editMenuItem(item: menuItem) {
    let navigationExtras: NavigationExtras = { 
      queryParams: {
        'menuid': item.id, 
        'menuName': item.name,
        'menuQty': item.qty,
        'menuPrice': item.price,
        'menuDisc': item.discount
      }
    };
    this.router.navigate(['work/menuItem-create'], navigationExtras);
  }

  onDelete(id: string) {
    if (confirm("вы уверенны что хотите удалить запись?")) {
      this.firestore.doc('menulist/' + id).delete();
      this.dataService.openSnackBar('Удаление эелемента меню...','завершено!');
    }
  }

}