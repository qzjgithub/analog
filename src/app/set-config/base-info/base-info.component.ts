import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {ConfigService} from "../../../control/config/config.service";
import {AppState} from "../../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../../control/app.store";

import {getConfigState} from "../../../control/config/config.reducer";

@Component({
  selector: 'base-info',
  templateUrl: 'base-info.component.html',
  styleUrls: ['base-info.component.css']
})
export class BaseInfoComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    if(!this.validateForm.valid) return;
    this.configService.setBaseInfo(this.validateForm.value)
      .then((data)=>{
        this._message.create('success','系统基本信息设置成功');
        this.validateForm.reset(this.validateForm.value);
      })
      .catch((err)=>{
        this.reset();
      })
  }

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private fb: FormBuilder,
    private configService: ConfigService,
    private _message: NzMessageService
  ) { }

  ngOnInit() {
    let remote = this.getBaseInfo();
    this.validateForm = this.fb.group({
      defaultPwd : [ remote['defaultPwd'], [ Validators.required ] ],
      systemName : [ remote['systemName'], [ Validators.required ] ]
    });
  }

  getBaseInfo(){
    const state = this.store.getState();
    let config = getConfigState(state);
    return config['config'];
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  reset(){
    let remote = this.getBaseInfo();
    this.validateForm.reset({
      defaultPwd : remote['defaultPwd'],
      systemName : remote['systemName']
    })
    return false;
  }

}
