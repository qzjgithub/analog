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
import {ActivatedRoute, Router} from "@angular/router";
import {enableProdMode} from '@angular/core';
enableProdMode();

@Component({
  selector: 'remote-server',
  templateUrl: 'remote-server.component.html',
  styleUrls: ['remote-server.component.css'],
})
export class RemoteServerComponent implements OnInit {
  validateForm: FormGroup;

  /**
   * 当前设置来源于哪里
   * @type {string}
   */
  @Input()
  pattern = 'config';
  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    this.configService.setRemoteService(this.validateForm.value)
      .then((data)=>{
        this._message.create('success','远程服务设置成功');
        this.validateForm.reset(this.validateForm.value);
        if(this.validateForm.value['remoteServer']){
          this.configService.testAnalog()
            .then(()=>{
              this._message.create('success','远程服务连接测试成功');
              if(this.pattern==='config'){
                this.router.navigate(['loginManage']);
              }
            })
            .catch((err)=>{
              this._message.create('error','远程服务连接测试失败');
            })
        }
      })
      .catch((err)=>{
        this.reset();
      })
  }

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private fb: FormBuilder,
              private configService: ConfigService,
              private _message: NzMessageService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    let remote = this.getRemoteServer();
    this.validateForm = this.fb.group({
      remoteServer : [ remote['openRemote'] ],
      address : [ remote['address'], [ Validators.required ] ],
      port : [ remote['port'], [ Validators.required ] ],
      prefix : [ remote['prefix'] ]
    });
  }

  getRemoteServer(){
    const state = this.store.getState();
    let config = getConfigState(state);
    return Object.assign({},config['config']['remoteService'],{openRemote: config['config']['openRemote']});
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  reset(){
    let remote = this.getRemoteServer();
    this.validateForm.reset({
      remoteServer: remote['openRemote'],
      address : remote['address'],
      port : remote['port'],
      prefix : remote['prefix']
    })
    return false;
  }

}
