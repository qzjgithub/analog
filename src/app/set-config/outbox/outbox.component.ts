import {Component, OnInit, Inject} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {Store} from "redux";
import {AppState} from "../../../control/app.reducer";
import {AppStore} from "../../../control/app.store";
import {getConfigState} from "../../../control/config/config.reducer";
import {ConfigService} from "../../../control/config/config.service";
import {NzMessageService} from "ng-zorro-antd";
@Component({
  selector: 'outbox',
  templateUrl: 'outbox.component.html',
  styleUrls: ['outbox.component.css']
})
export class OutboxComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    this.configService.setOutBox(this.validateForm.value)
      .then((data)=>{
        this._message.create('success','发件人邮箱配置成功');
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
    let remote = this.getOutBox();
    this.validateForm = this.fb.group({
      mailbox : [ remote['mailbox'], [ Validators.required ] ],
      smtpAddress : [ remote['smtpAddress'], [ Validators.required ] ],
      smtpPort : [ remote['smtpPort'] , [ Validators.required ]],
      smtpUserName : [ remote['smtpUserName'] , [ Validators.required ]],
      smtpPwd : [ remote['smtpPwd'] , [ Validators.required ]]
    });
  }

  getOutBox(){
    const state = this.store.getState();
    let config = getConfigState(state);
    return config['config']['outbox'];
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  reset(){
    let remote = this.getOutBox();
    this.validateForm.reset({
      mailbox : remote['mailbox'],
      smtpAddress : remote['smtpAddress'],
      smtpPort : remote['smtpPort'],
      smtpUserName : remote['smtpUserName'],
      smtpPwd : remote['smtpPwd']
    })
    return false;
  }

}
