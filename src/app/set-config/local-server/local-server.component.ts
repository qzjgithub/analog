import {Component, OnInit, Inject, Input} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {Store} from "redux";
import {AppState} from "../../../control/app.reducer";
import {AppStore} from "../../../control/app.store";
import {getConfigState} from "../../../control/config/config.reducer";
import {ConfigService} from "../../../control/config/config.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'local-server',
  templateUrl: 'local-server.component.html',
  styleUrls: ['local-server.component.css']
})
export class LocalServerComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    this.configService.setLocalService(this.validateForm.value)
      .then((data)=>{
        this._message.create('success','本地服务设置成功');
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
    let remote = this.getLocalServer();
    this.validateForm = this.fb.group({
      localServer : [ false ],
      port : [ remote['port'], [ Validators.required ] ],
      prefix : [ remote['prefix'] ]
    });
  }

  getLocalServer(){
    const state = this.store.getState();
    let config = getConfigState(state);
    return config['config']['localService'];
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  reset(){
    let remote = this.getLocalServer();
    this.validateForm.reset({
      localServer: false,
      port : remote['port'],
      prefix : remote['prefix']
    })
    return false;
  }

}
