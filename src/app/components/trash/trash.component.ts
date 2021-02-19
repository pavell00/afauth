import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { trashItem } from '../../core/models/trashItem';

@Component({
  selector: 'trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit, OnDestroy {
  trash: trashItem[] = [];
  displayedColumns: string[];
  private subscription: Subscription;
  
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.displayedColumns = ['OrderDate','tableNo','Name','Sum','User','ActDate','Act'];
    this.subscription = this.dataService.getTrash().subscribe(actionArray => {
        this.trash = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data() as trashItem
          }
        })
      });
  }

  onDelete(id: string) {
    if (confirm("Вы уверенны что хотите удалить заказ?")) {
      this.dataService.deleteItemFromTrash(id);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
