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
    this.setBreadcrumb();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      saveType : [ null, [ Validators.required ]  ],
      dataType : [null,[ Validators.required ]],
      active : [true],
      comment          : [ null ],
      data: [null,[Validators.required]]
    });
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情','添加数据'],1));
  }

  getSelect() {
    if (!this.project['account']) return;
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
