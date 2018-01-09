import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../control/user/user.service";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  host: {
    'style' : 'width:25%;display:block;max-width:300px'
  }
})
export class LoginComponent implements OnInit {

  /**
   * 登录表单
   */
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private userService: UserService) {
  }

  _submitForm = async ()=> {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
    }
    if(!this.loginForm.valid) return;
    console.log(this.loginForm.value);
    let result = await this.userService.validLogin({});
    console.log(result);
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });
  }

}
