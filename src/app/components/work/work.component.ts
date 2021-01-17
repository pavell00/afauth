import { Component, OnInit, Inject } from '@angular/core';
import { Post } from '../../core/models/post';
import { User } from '../../core/models/user';
import { PostService } from '../../core/services/post.service'
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

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
  public isShowPRN: boolean ;

  constructor(private postService: PostService, public auth: AuthService, 
    private dataService: DataService) { }

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
    );
    this.auth.user$.subscribe(
      res => {this.user= res}
    );
    this.dataService.isShowPRNButton.subscribe( res => {this.isShowPRN = res;} )
  }

  onDelete(docId: string) {
    this.postService.deletePost(docId);
  }

  createPost() {
    let p: Post = {
      title: 'new post',
      body: 'lorem ipsum',
      user: this.user.uid
    }
    this.postService.createPost(p);
  }

  print() {
    this.dataService.changeStatePrnButton(false);
    window.print();
  }

}