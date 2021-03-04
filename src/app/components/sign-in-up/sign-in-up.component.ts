import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sign-in-up',
  templateUrl: './sign-in-up.component.html',
  styleUrls: ['./sign-in-up.component.css']
})
export class SignInUpComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  printUser(event) {
    console.log(event);
  }
  
  printError(event) {
      console.error(event);
  }
}
