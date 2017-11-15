import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * 登录表单
   */
  loginForm: FormGroup;

  _submitForm() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
    }
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ],
    });
  }

}
