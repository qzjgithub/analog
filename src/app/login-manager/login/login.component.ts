import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../control/user/user.service";
import {Router, ActivatedRoute} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";
import {ConfigService} from "../../../control/config/config.service";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  host: {
    'style' : 'width:25%;display:block;max-width:300px;min-width:200px;'
  }
})
export class LoginComponent implements OnInit {

  /**
   * 登录表单
   */
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private _message: NzMessageService,
              private userService: UserService,
              private configService: ConfigService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  _submitForm = ()=> {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
    }
    if (!this.loginForm.dirty || !this.loginForm.valid) return;
    this.userService.validLogin(this.loginForm.value)
      .then((data)=>{
        sessionStorage.setItem('userId',data['id']);
        this.router.navigate(['checkUser']);
      })
      .catch((err)=>{
        this._message.create('error',err.message);
        console.log(err);
      })
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      account: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });
    sessionStorage.removeItem('userId');
    //this.configService.clearLogin();
  }

  gotoRegister(){
    this.router.navigate([{outlets: {'userEnter': 'register'}}],{relativeTo: this.route.parent});
    return false;
  }

}
