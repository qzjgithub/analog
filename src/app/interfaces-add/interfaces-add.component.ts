import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {InterfacesService} from "../../control/interfaces/interfaces.service";
import {ConfigService} from "../../control/config/config.service";
import {NzMessageService} from "ng-zorro-antd";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";

import * as ConfigActions from '../../control/config/config.action';
import {UserService} from "../../control/user/user.service";

@Component({
  selector: 'app-interfaces-add',
  templateUrl: './interfaces-add.component.html',
  styleUrls: ['./interfaces-add.component.css']
})
export class InterfacesAddComponent implements OnInit {
  validateForm: FormGroup;

  users : Array<any>;

  method : Array<any>;

  login: any;

  project: any;

  modular: any;

  fullPath: string;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    let value = this.validateForm.value;
    value['parent'] = "";
    if(this.modular['id']){
      value['parent'] = this.modular['id'];
    }
    value['creator'] = this.login['account'];
    value['fullPath'] = this.fullPath + value['url'];
    this.interfacesService.addInterfaces(this.project['account'],value)
      .then(()=>{
        this._message.create('success','添加接口成功');
        this.router.navigate([{outlets: {'modular': 'modular'}}],{relativeTo: this.route.parent});
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
    private interfacesService: InterfacesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.users = [];
    this.method = [];
    this.modular = {};
    this.fullPath = '';
    this.login = this.configService.getStateLogin();
    this.store.subscribe(()=>this.dealData());
    this.setBreadcrumb();
    //this.getCurProject();
    this.getSelect();
    this.getFullPath();
  }

  getFullPath(){
    this.interfacesService.getFullPathByModularId(this.project['account'],this.modular['id'])
      .then((path)=>{
        this.fullPath = (this.project['url']||'') + path.join('');
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  dealData(){
    const state = this.store.getState();
    this.project = state['project']['project'];
    this.modular = state['modular']['modular'];
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['添加接口'],3));
  }

  getSelect(){
    if(!this.project['account']) return;
    this.interfacesService.getSelect()
      .then((data)=>{
        this.method = data['method'];
      })
      .catch((err)=>{
        console.log(err);
      })
    this.userService.getWritableUser(this.project['account'])
      .then((data)=>{
        this.users = data;
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      url : [ null, [ Validators.required ]  ],
      method : ['GET',[ Validators.required ]],
      writer : [null],
      comment          : [ null ],
    });
  }

  backModular(){
    this.router.navigate([{outlets: {'modular': 'modular'}}],{relativeTo: this.route.parent})
    return false;
  }

}
