import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../control/user/user.service";
import {Router, ActivatedRoute} from "@angular/router";

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

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  _submitForm = ()=> {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
    }
    if(!this.loginForm.valid) return;
    console.log(this.loginForm.value);
    this.userService.validLogin(this.loginForm.value)
      .then((data)=>{
        console.log(data);
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      account: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });
  }

  gotoRegister(){
    this.router.navigate([{outlets: {'userEnter': 'register'}}],{relativeTo: this.route.parent});
    return false;
  }

}
