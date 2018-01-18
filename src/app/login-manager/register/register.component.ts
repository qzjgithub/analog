import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../control/user/user.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
  host: {
    'style' : 'width:35%;display:block;min-width:300px;'
  }
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;

  position: Array<any>;

  phonePrefix: Array<any>;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    if(!this.validateForm.valid) return;
    console.log(this.validateForm.value);
    let value = this.validateForm.value;
    value = {
      account: value.account,
      password: value.password,
      name: value.name,
      position: value.position,
      phoneNumberPrefix: value.phoneNumberPrefix,
      phone: value.phone,
      email: value.email,
      comment: value.comment
    }
    value['phone'] = value['phoneNumberPrefix']+'-'+value['phone'];
    value['active'] = true;
    delete value['phoneNumberPrefix'];
    this.userService.add(value)
      .then((data)=>{
        this._message.create('success','注册成功');
        this.backLogin({});
      })
      .catch((err)=>{
        this._message.create('error',err.message);
      })
  }

  constructor(private fb: FormBuilder,
              private _message: NzMessageService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.position = [];
    this.phonePrefix = [];
    this.getSelect();
  }

  getSelect(){
    this.userService.getSelect()
      .then((data)=>{
        this.position = data.position;
        this.phonePrefix = data.phonePrefix;
      })
  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.validateForm.controls[ 'checkPassword' ].updateValueAndValidity();
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls[ 'password' ].value) {
      return { confirm: true, error: true };
    }
  };

  onlyoneVlidator = (control: FormControl):  Promise<ValidationErrors | null> => {
    return new Promise((resolve,reject) => {
      if (!control.value) {
        resolve({ required: true });
      } else {
        this.userService.validExist({ account : control.value})
          .then(()=>{
            reject({ exist: false, error: false })
          })
          .catch((err) => {
            resolve({ exist: true, error: true });
          });
      }
    })
  };

  ngOnInit() {
    this.validateForm = this.fb.group({
      account            : [ null, [ Validators.required ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      name         : [ null, [ Validators.required ] ],
      position    : [ 'frontEndEngineer' ],
      phoneNumberPrefix: [ '+86' ],
      phone      : [ null, [ Validators.required ] ],
      email          : [ null, [ Validators.email ] ],
      comment          : [ null ],
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  backLogin(e){
    this.router.navigate([{outlets: {'userEnter': 'login'}}],{relativeTo: this.route.parent});
    return false;
  }

}
