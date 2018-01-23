import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {UserService} from "../../control/user/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import * as ConfigActions from '../../control/config/config.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent implements OnInit {
  validateForm: FormGroup;

  position: Array<any>;

  phonePrefix: Array<any>;

  /**
   * 原用户信息
   */
  data : any;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    let value = this.validateForm.value;
    let ph = value['phoneNumberPrefix']+'-'+value['phone'];
    let { name, position, email, comment } = value;
    this.userService.modifyUser({ name, position, email, comment, phone:ph, id:this.data['id'] })
      .then(()=>{
        this._message.create('success','修改成功');
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
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    route.queryParams.subscribe(queryParams => {
      this.data = Object.assign({},queryParams);
      this.dealData();
    });
    this.position = [];
    this.phonePrefix = [];
    this.setBreadcrumb();
    this.getSelect();
  }

  dealData(){
    if(this.data['phone']){
      let arr = this.data['phone'].split('-');
      this.data['phoneNumberPrefix'] = arr[0];
    }
  }

  getSelect(){
    this.userService.getSelect()
      .then((data)=>{
        this.position = data['position'];
        this.phonePrefix = data['phonePrefix'];
      })
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['用户管理','修改用户'],1));
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name         : [ this.data['name'], [ Validators.required ] ],
      position    : [ this.data['position'] || 'frontEndEngineer' , [ Validators.required ]],
      phoneNumberPrefix: [ this.data['phoneNumberPrefix'] || '+86' ],
      phone      : [ (this.data['phone'] ? this.data['phone'].split('-')[1] : ''), [ Validators.required ] ],
      email          : [ this.data['email'], [ Validators.email ] ],
      comment          : [ this.data['comment'] ],
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  backUser(){
    this.router.navigate([{outlets: {'content': 'user'}}],{relativeTo: this.route.parent});
  }

}
