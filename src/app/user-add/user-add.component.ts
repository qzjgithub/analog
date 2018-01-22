import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppStore} from "../../control/app.store";
import {Store} from "redux";
import {AppState} from "../../control/app.reducer";
import {NzMessageService} from "ng-zorro-antd";
import {ConfigService} from "../../control/config/config.service";
import {UserService} from "../../control/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  validateForm: FormGroup;

  position: Array<any>;

  phonePrefix: Array<any>;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.valid) return;
    let value = this.validateForm.value;
    value = {
      account: value.account,
      password: this.configService.getStateConfig()['defaultPwd'],
      name: value.name,
      position: value.position,
      phoneNumberPrefix: value.phoneNumberPrefix,
      phone: value.phone,
      email: value.email,
      comment: value.comment
    }
    value['phone'] = value['phoneNumberPrefix']+'-'+value['phone'];
    value['active'] = false;
    delete value['phoneNumberPrefix'];
    this.userService.add(value)
      .then((data)=>{
        this._message.create('success','添加成功');
        this.backUser();
      })
      .catch((err)=>{
        this._message.create('error',err.message);
      })
  }

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private fb: FormBuilder,
    private _message: NzMessageService,
    private configService: ConfigService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setBreadcrumb();
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

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['用户管理','添加用户'],1));
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      account            : [ null, [ Validators.required ] ],
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

  backUser(){
    this.router.navigate([{outlets: {'content': 'user'}}],{relativeTo: this.route.parent})
  }

}
