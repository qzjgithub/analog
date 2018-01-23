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

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  validateForm: FormGroup;

  authority : Array<any>;

  users : Array<any>;

  login: any;

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    let creator =this.login['account'];
    let value = Object.assign({},this.validateForm.value,{ creator: creator});
    this.projectService.add(value)
      .then((data)=>{
        this._message.create('success','添加成功');
        this.backProject();
      })
      .catch((err)=>{
        console.log(err);
        this._message.create('error',err.message);
      })
  }

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private fb: FormBuilder,
    private _message: NzMessageService,
    private configService: ConfigService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setBreadcrumb();
    this.authority = [];
    this.users = [];
    this.login = this.configService.getStateLogin();
    this.getSelect();
  }

  getSelect(){
    this.users.push(this.login);
    this.projectService.getSelect({ role: this.login.role})
      .then((data)=>{
        this.authority = data['authority'];
        if(data['users']){
          this.users = [...this.users, ...data['users']];
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      account            : [ null, [ Validators.required ] ],
      name         : [ null, [ Validators.required ] ],
      leader  : [ this.login['account'], [ Validators.required ] ],
      port    : [ null, [ Validators.required ] ],
      url : [ null ],
      authority      : [ 'public' ],
      comment          : [ null ],
    });
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','添加项目'],1));
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  backProject(){
    this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent})
  }

}
