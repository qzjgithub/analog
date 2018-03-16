import {Component, OnInit, Inject, Input} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../control/project/project.service";
import {ConfigService} from "../../control/config/config.service";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import * as ConfigActions from '../../control/config/config.action';
import * as ProjectActions from '../../control/project/project.action';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {NzMessageService, NzModalSubject} from "ng-zorro-antd";

@Component({
  selector: 'app-project-modify',
  templateUrl: './project-modify.component.html',
  styleUrls: ['./project-modify.component.css']
})
export class ProjectModifyComponent implements OnInit {
  validateForm: FormGroup;

  authority : Array<any>;
  /**
   * 原用户信息
   */
  _project : any;

  @Input()
  set project(value: any){
    this._project = value;
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    this.projectService.modifyProject(Object.assign({},this.validateForm.value,{account: this._project.account}))
      .then(()=>{
        this.store.dispatch(ProjectActions.getCurProject(Object.assign({},this._project,this.validateForm.value)));
        this._message.create('success','项目修改成功');
      })
      .catch((err)=>{
        this._message.create('error',err.message);
      })
  }

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private _message: NzMessageService,
    private projectService: ProjectService
  ) {
    this.authority = [];
    this.getSelect();
    this.subject.on('onOk',()=>{
      this._submitForm();
    })
  }

  getSelect(){
    this.projectService.getSelect({ })
      .then((data)=>{
        this.authority = data['authority'];
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name         : [ this._project['name'], [ Validators.required ] ],
      port    : [ this._project['port'], [ Validators.required ] ],
      authority      : [ this._project['authority'] ],
      comment          : [ this._project['comment'] ],
    });
  }


  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

}
