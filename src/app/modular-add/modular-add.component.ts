import {Component, OnInit, Inject} from '@angular/core';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";

import * as ConfigActions from '../../control/config/config.action';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {ConfigService} from "../../control/config/config.service";
import {UserService} from "../../control/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../control/project/project.service";
import {ModularService} from "../../control/modular/modular.service";

@Component({
  selector: 'app-modular-add',
  templateUrl: './modular-add.component.html',
  styleUrls: ['./modular-add.component.css']
})
export class ModularAddComponent implements OnInit {
  validateForm: FormGroup;

  users : Array<any>;

  login: any;

  project: any;

  modular: any;

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
    this.modularService.addModular(this.project['account'],value)
      .then(()=>{
        this._message.create('success','添加模块成功');
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
    private modularService: ModularService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.subscribe(()=>this.getCurProject());
    this.setBreadcrumb();
    this.getCurProject();
    this.users = [];
    this.modular = {};
    this.login = this.configService.getStateLogin();
    this.getSelect();
  }

  getCurProject(){
    const state = this.store.getState();
    this.project = state['project']['project'];
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['添加模块'],3));
  }

  getSelect(){
    if(!this.project['account']) return;
    this.modularService.getSelect(this.project['account'])
      .then((data)=>{
        this.users = data;
      })
      .catch((err)=>{
        console.log(err);
      })
  }


  ngOnInit() {
    this.validateForm = this.fb.group({
      name         : [ null, [ Validators.required ] ],
      url : [ null ],
      writer : [null],
      comment          : [ null ],
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  backModular(){
    this.router.navigate([{outlets: {'modular': 'modular'}}],{relativeTo: this.route.parent})
    return false;
  }

}
