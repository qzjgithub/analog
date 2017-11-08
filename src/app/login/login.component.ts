import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**
   * 登录表单
   */
  loginForm: FormGroup;

  /**
   * 当前连接模式，是本地还是服务端
   */
  pattern: String;

  _submitForm() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
    }
  }

  changePattern(){
    this.pattern = this.pattern==='local' ? 'remote' : 'local';
  }

  constructor(private fb: FormBuilder) {
    this.pattern = 'local';
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ],
    });
  }

}
