import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../control/user/user.service";
import {ConfigService} from "../../control/config/config.service";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";

import * as ConfigActions from '../../control/config/config.action';
import {NzMessageService} from "ng-zorro-antd";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'person-center',
  templateUrl: './person-center.component.html',
  styleUrls: ['./person-center.component.css']
})
export class PersonCenterComponent implements OnInit {
  validateForm: FormGroup;

  position: Array<any>;

  phonePrefix: Array<any>;

  login: any;

  pattern: any;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    let value = this.validateForm.value;
    let ph = value['phoneNumberPrefix']+'-'+value['phone'];
    let { name, position, email, comment } = value;
    this.userService.modifyUser({ name, position, email, comment, phone:ph, id:this.login['id'] })
      .then(()=>{
        this._message.create('success','修改成功');
        this.validateForm.reset();
        this.validateForm.setValue(value);
        this.pattern = 'display';
        this.store.dispatch(ConfigActions.getLogin(Object.assign(this.login,value)));
      })
      .catch((err)=>{
        this._message.create('error',err.message);
      })
  }

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private _message: NzMessageService,
    private fb: FormBuilder,
    private userService: UserService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.subscribe(()=>this.initLogin());
    this.position = [];
    this.phonePrefix = [];
    this.pattern = 'display';
    this.setBreadcrumb();
    this.getSelect();
    this.initLogin();
  }

  getSelect(){
    this.userService.getSelect()
      .then((data)=>{
        this.position = data['position'];
        this.phonePrefix = data['phonePrefix'];
      })
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction('个人信息',1));
  }

  initLogin(){
    this.login = this.configService.getStateLogin();
    if(this.login['phone']){
      let arr = this.login['phone'].split('-');
      this.login['phoneNumberPrefix'] = arr[0];
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name         : [ this.login['name'], [ Validators.required ] ],
      position    : [ this.login['position'] || 'frontEndEngineer' ],
      phoneNumberPrefix: [ this.login['phoneNumberPrefix'] || '+86' ],
      phone      : [ this.login['phone'].split('-')[1], [ Validators.required ] ],
      email          : [ this.login['email'], [ Validators.email ] ],
      comment          : [ this.login['comment'] ],
    });
  }

  changePattern(pattern){
    this.pattern = pattern;
    if(pattern==='display'){
      let { name, position, phoneNumberPrefix, phone, email, comment } = this.login;
      phone = phone.split('-')[1];
      this.validateForm.reset({ name, position, phoneNumberPrefix, phone, email, comment });
      // this.validateForm.setValue({ name, position, phoneNumberPrefix, phone, email, comment });
    }
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  modifyPwd(){
    this.router.navigate([{outlets: {'content': 'personPwd'}}],{relativeTo: this.route.parent})
  }

}
