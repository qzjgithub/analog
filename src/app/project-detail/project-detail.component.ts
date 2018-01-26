import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import * as ProjectActions from '../../control/project/project.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {Router, ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../control/project/project.service";
import {ConfigService} from "../../control/config/config.service";
import {NzModalService, NzMessageService} from "ng-zorro-antd";

import {ProjectModifyComponent} from '../project-modify/project-modify.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: any;

  isConfirmLoading: boolean;

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private configService: ConfigService,
    private _message: NzMessageService,
    private projectService: ProjectService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((queryParams)=>{
      //this.project = queryParams;
      this.store.dispatch(ProjectActions.getCurProject(queryParams));
    });
    this.isConfirmLoading = false;
    this.store.subscribe(()=> this.dealProject())
    this.setBreadcrumb();
  }


  dealProject(){
    const state = this.store.getState();
    this.project = state['project']['project'];
  }

  ngOnInit() {
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情'],1));
  }

  getDate(data){
    let date = new Date(Number(data));
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }

  modifyProject(e){
    e.stopPropagation();
    const modal = this.modalService.open({
      title   : '修改项目',
      content : ProjectModifyComponent,
      closable: false,
      showConfirmLoading: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
      },
      componentParams : {
        project: this.project
      }
    })
  }

  modifyProUrl(e){
    e.stopPropagation();
  }

  deleteProject(e,contentTp,footerTp){
    e.stopPropagation();
    const modal = this.modalService.open({
      title   : '删除项目',
      content : contentTp,
      closable: true,
      showConfirmLoading: true,
      maskClosable: false,
      footer: footerTp
    });
  }

  confirmDeleteProject(e,del){
    if(del){
      return new Promise((resovle, reject)=>{
        this.projectService.deleteProject(this.project['account'],true)
          .then(()=>{
            resovle();
            this.store.dispatch(ProjectActions.getCurProject(null));
            this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent})
          })
          .catch((err)=>{
            this._message.create('error',err.mesage);
            reject();
          })
      })
    }else{
      return new Promise((resovle, reject)=>{
        this.projectService.deleteProject(this.project['account'],false)
          .then(()=>{
            resovle();
            this.store.dispatch(ProjectActions.getCurProject(null));
            this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent})
          })
          .catch((err)=>{
            this._message.create('error',err.mesage);
            reject();
          })
      })
    }
  }

}
