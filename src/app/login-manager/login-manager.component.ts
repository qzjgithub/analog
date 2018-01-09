import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'login-manager',
  templateUrl: './login-manager.component.html',
  styleUrls: ['./login-manager.component.css']
})
export class LoginManagerComponent implements OnInit {
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
