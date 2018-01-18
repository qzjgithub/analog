import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../control/user/user.service";
import {ConfigService} from "../../control/config/config.service";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";

import * as ConfigActions from '../../control/config/config.action';

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

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private fb: FormBuilder,
    private userService: UserService,
    private configService: ConfigService
  ) {
    this.store.subscribe(()=>this.initLogin());
    this.position = [];
    this.phonePrefix = [];
    this.pattern = 'display';
    this.getSelect();
    this.initLogin();
  }

  getSelect(){
    this.userService.getSelect()
      .then((data)=>{
        this.position = data.position;
        this.phonePrefix = data.phonePrefix;
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
      this.login['phone'] = arr[arr.length-1];
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name         : [ this.login['name'], [ Validators.required ] ],
      position    : [ this.login['position'] || 'frontEndEngineer' ],
      phoneNumberPrefix: [ this.login['phoneNumberPrefix'] || '+86' ],
      phone      : [ this.login['phone'], [ Validators.required ] ],
      email          : [ this.login['email'], [ Validators.email ] ],
      comment          : [ this.login['comment'] ],
    });
  }

  changePattern(pattern){
    this.pattern = pattern;
    if(pattern==='display'){
      this.validateForm.setValue(this.login);
    }
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

}
