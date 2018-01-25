import {Component, OnInit, Inject} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../control/project/project.service";
import {ConfigService} from "../../control/config/config.service";
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import * as ConfigActions from '../../control/config/config.action';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";

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
  data : any;

  scope : '';

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
    if (!this.validateForm.dirty || !this.validateForm.valid) return;
    this.projectService.modifyProject(Object.assign({},this.validateForm.value,{id: this.data.id}))
      .then(()=>{
        this.backProject();
        this._message.create('success','项目修改成功');
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
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    route.queryParams.subscribe(queryParams => {
      this.scope = queryParams['scope'];
      this.data = Object.assign({},queryParams);
      delete this.data['scope'];

    });
    this.setBreadcrumb();
    this.authority = [];
    this.getSelect();
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
      name         : [ this.data['name'], [ Validators.required ] ],
      port    : [ this.data['port'], [ Validators.required ] ],
      url : [ this.data['url'] ],
      authority      : [ this.data['authority'] ],
      comment          : [ this.data['comment'] ],
    });
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','修改项目'],1));
  }

  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

  backProject(){
    this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent});
  }

}
