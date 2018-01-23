import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {UserService} from "../../control/user/user.service";
import {NzMessageService} from "ng-zorro-antd";
import {ConfigService} from "../../control/config/config.service";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import * as ConfigActions from '../../control/config/config.action';

@Component({
  selector: 'app-person-password',
  templateUrl: './person-password.component.html',
  styleUrls: ['./person-password.component.css']
})
export class PersonPasswordComponent implements OnInit {
  validateForm: FormGroup;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    let value = this.validateForm.value;
    value['id'] = this.configService.getStateLogin()['id'];
    this.userService.modifyPwdWithOld(value)
      .then(()=>{
        this._message.create('success','修改成功，请重新登录');
        this.configService.clearLogin();
        this.router.navigate(['loginManage']);
      })
      .catch((err)=>{
        this._message.create('error',err.message);
      })
  }

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private fb: FormBuilder,
              private _message: NzMessageService,
              private userService: UserService,
              private configService: ConfigService,
              private route: ActivatedRoute,
              private router: Router) {
    this.setBreadcrumb();
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['个人中心','修改密码'],1));
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      oldPassword            : [ null, [ Validators.required ] ],
      password         : [ null, [ Validators.required ] ],
      checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
    });
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

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  backPerson(){
    this.router.navigate([{outlets: {'content': 'person'}}],{relativeTo: this.route.parent});
    return false;
  }

}
