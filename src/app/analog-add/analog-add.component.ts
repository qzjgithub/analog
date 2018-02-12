import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {InterfacesService} from "../../control/interfaces/interfaces.service";
import {UserService} from "../../control/user/user.service";
import {ConfigService} from "../../control/config/config.service";
import {NzMessageService} from "ng-zorro-antd";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {AnalogService} from "../../control/analog/analog.service";

import * as ConfigActions from '../../control/config/config.action';

@Component({
  selector: 'app-analog-add',
  templateUrl: './analog-add.component.html',
  styleUrls: ['./analog-add.component.css']
})
export class AnalogAddComponent implements OnInit {

  validateForm: FormGroup;

  login: any;

  project: any;

  interfaces: any;

  saveType : Array<any>;

  dataType : Array<any>;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    let value = this.validateForm.value;
    value['parent'] = "";
    if(this.interfaces['id']){
      value['parent'] = this.interfaces['id'];
    }else{
      this._message.create('error','接口不明确，请重新进入添加');
      this.router.navigate([{outlets: {'modular': 'modular'}}],{relativeTo: this.route.parent});
      return;
    }
    value['creator'] = this.login['account'];
    this.analogService.addAnalog(this.project['account'],value)
      .then(()=>{
        this._message.create('success','添加模拟数据成功');
        this.router.navigate([{outlets: {'modular': 'analog'}}],{relativeTo: this.route.parent});
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
    private analogService: AnalogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.saveType = [];
    this.dataType = [];
    this.project = {};
    this.interfaces = {};
    this.login = this.configService.getStateLogin();
    this.store.subscribe(()=>this.dealData());
    this.setBreadcrumb();
    this.getSelect();
  }

  dealData(){
    const state = this.store.getState();
    this.project = state['project']['project'];
    this.interfaces = state['interfaces']['interfaces'];
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      saveType : [ 'text', [ Validators.required ]  ],
      dataType : ['json',[ Validators.required ]],
      active : [true],
      comment          : [ null ],
      data: [null,[Validators.required]]
    });
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情','添加数据'],1));
  }

  getSelect() {
    this.analogService.getSelect()
      .then((data) => {
        this.saveType = data['saveType'];
        this.dataType = data['dataType'];
      })
      .catch((err) => {
        console.log(err);
      })
  }

  backModular(e){
    this.router.navigate([{outlets: {'modular': 'modular'}}],{relativeTo: this.route.parent});
  }

}
