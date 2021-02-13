import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { version } from '../../../../package.json';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  value: string;
  public version: string = version;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onSave(name: string, uid: string) {
    this.auth.setUserName(name, uid);
  }
}
