import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { menuItem } from '../../core/models/menuItem';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router, NavigationExtras }     from '@angular/router';

@Component({
    selector: 'menuItem-create',
    templateUrl: './menuItem-create.component.html',
    styleUrls: ['./menuItem-create.component.css']
})
export class MenuItemCreateComponent implements OnInit {
  formData: menuItem;
  id: string;
  name: string;
  price: number = 10;
  qty: number = 1;
  discount: number = 0;
  title: string;

  constructor(private dataService: DataService, private firestore: AngularFirestore,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.formData = {
          id: params["menuid"],
          name: params['menuName'],
          price: params['menuPrice'],
          qty: params['menuQty'],
          discount: params['menuDisc'],
        }
        if (this.formData.id) {
          this.title = 'Редактирование элемента меню';
        }
        else {
          this.title = 'Добавить новый элемент меню';
          this.formData = {
            //id: null,
            name: '',
            price: 10,
            qty: 1,
            discount: 0,
          }
        }
      });
      //this.dataService.items.subscribe(res => this.list = res)
      //this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      //form.resetForm();
      this.formData = {
      //id: null,
      name: '',
      price: 10,
      qty: 1,
      discount: 0,
    }
  }

  onSubmit(form: NgForm) {
    let data = Object.assign({}, form.value);
    //console.log(form.value, this.formData.id, data);
    //delete data.id;
    if (!this.formData.id)
      this.firestore.collection('menulist').add(data);
    else
      this.firestore.doc('menulist/' + this.formData.id).update(data);

    //this.resetForm(form);
    this.dataService.openSnackBar('Сохранение меню...', 'завершено!');
    this.router.navigateByUrl('work/menu-list');
  }

}