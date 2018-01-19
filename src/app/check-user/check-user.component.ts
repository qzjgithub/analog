import {Component, OnInit, Inject} from '@angular/core';
import {ConfigService} from "../../control/config/config.service";
import {Router, ActivatedRoute} from "@angular/router";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {UserService} from "../../control/user/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
@Component({
  selector: 'check-user',
  templateUrl: 'check-user.component.html',
  styleUrls: ['check-user.component.css'],
  host: {
    'class':'box_center',
    'style':'height:100%'
  }
})
export class CheckUserComponent implements OnInit {
  validateForm: FormGroup;
  login : any;
  userId: any;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.valid) return;
    let value = this.validateForm.value;
    value = {
      password : value.password,
      active : true,
      id : this.login.id
    }
    this.userService.modifyPwd(value)
      .then(()=>{
        this._message.create('success','修改成功，请重新登录');
        this.loginout(null);
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
    private router: Router
  ) {
    this.login = {};
    this.initCheckUser();
  }

  initCheckUser(){
    this.login = this.configService.getStateLogin();
    this.userId = sessionStorage.getItem('userId');
    if(!this.userId){
      this.router.navigate(['loginManage']);
    }else if(this.login.active){
      this.router.navigate(['home']);
    }else if(this.login.active===undefined){
      this.userService.getUserById({ id: this.userId})
        .then((data)=>{
          this.initCheckUser();
        })
        .catch((err)=>{
          this.router.navigate(['loginManage']);
          sessionStorage.removeItem('userId');
          this._message.create('error','登录错误');
        })
    }
  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.validateForm.controls[ 'checkPassword' ].updateValueAndValidity();
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls[ 'password' ].value) {
      return { confirm: true, error: true };
    }
  };

  ngOnInit() {
    this.validateForm = this.fb.group({
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
    });
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  loginout(e){
    this.configService.clearLogin();
    this.router.navigate(['loginManage']);
    return false;
  }

}
