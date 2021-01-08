import { Component, OnInit, Inject } from '@angular/core';
import { Post } from '../../core/post';
import { User } from '../../core/user';
import { PostService } from '../../core/post.service'
import { AuthService } from '../../core/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: string;
  title: string;
  body: string;
}

@Component({
  selector: 'work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  posts: Post[]=[];
  user: User;
  newData: Post;

  constructor(private postService: PostService, public auth: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.postService.getPosts().subscribe(
      actionArray => {
        this.posts = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data() as Post
          } 
        })
      }
    )
    this.auth.user$.subscribe(
      res => {this.user= res}
    )
  }

  onDelete(docId: string) {
    this.postService.deletePost(docId);
  }

  createPost() {
    this.postService.createPost();
  }

  openDialog(item: Post): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {id: item.id, title: item.title, body: item.body}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      if (result) {
        this.newData = result;
        //console.log(this.newData);
        //refresh data in array
        for(let i = 0; i < this.posts.length; i++) {
          if(this.posts[i].id == this.newData.id) {
            this.posts[i].title = this.newData.title;
            this.posts[i].body = this.newData.body;
          }
        }
        //update data in DB Collection
        //console.log(this.orderId)
        this.postService.updatePost(this.newData)
      }
    });
  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './edit-dialog.html',
  styleUrls: ['./edit-dialog.css']
})
export class DialogOverviewExampleDialog {
  id: string;
  title: string;
  body: string;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}