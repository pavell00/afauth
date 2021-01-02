import { Injectable } from '@angular/core';
import { Post } from '../core/post';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { toPublicName } from '@angular/compiler/src/i18n/serializers/xmb';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private afs: AngularFirestore) {

  }

  getPosts() {
    return this.afs.collection('posts').snapshotChanges();
  }

  async updatePost(p: Post) {
    var lineRef = this.afs.collection('posts').doc(p.id)
    try {
      await lineRef.update({
        title: p.title,
        body: p.body
      })
    } catch (error) {
      console.error("Error updating document:  you're haven't access or ", error);
    }
  }

  createPost(p: Post) {

  }

  deletePost(id: string) {

  }
}
