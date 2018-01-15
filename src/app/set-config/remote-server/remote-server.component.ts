import {Component, OnInit, Inject} from '@angular/core';
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
import {enableProdMode} from '@angular/core';
enableProdMode();

@Component({
  selector: 'remote-server',
  templateUrl: 'remote-server.component.html',
  styleUrls: ['remote-server.component.css'],
  host : {
    style : 'display: block;width: 30%;'
  }
})
export class RemoteServerComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    this.configService.setRemoteService(this.validateForm.value)
      .then((data)=>{
        this._message.create('success','远程服务设置成功');
      })
      .catch((err)=>{
        this.reset();
      })
  }

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private fb: FormBuilder,
              private configService: ConfigService,
              private _message: NzMessageService) {
  }

  ngOnInit() {
    let remote = this.getRemoteServer();
    this.validateForm = this.fb.group({
      address : [ remote['address'], [ Validators.required ] ],
      port : [ remote['port'], [ Validators.required ] ],
      prefix : [ remote['prefix'] ],
    });
  }

  getRemoteServer(){
    const state = this.store.getState();
    let config = getConfigState(state);
    return config['config']['remoteService'];
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  reset(){
    let remote = this.getRemoteServer();
    this.validateForm.setValue({
      address : remote['address'],
      port : remote['port'],
      prefix : remote['prefix']
    })
    return false;
  }

}
