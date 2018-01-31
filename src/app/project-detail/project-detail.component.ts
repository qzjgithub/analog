import {Component, OnInit, Inject,OnDestroy } from '@angular/core';
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
import {ModularService} from "../../control/modular/modular.service";

import * as ModularActions from '../../control/modular/modular.action';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit,OnDestroy  {

  project: any;

  isConfirmLoading: boolean;

  modal: any;

  login: any;

  modulars: any;

  parent:any;

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private configService: ConfigService,
    private _message: NzMessageService,
    private projectService: ProjectService,
    private modularService: ModularService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isConfirmLoading = false;
    this.login = this.configService.getStateLogin();
    this.store.subscribe(()=> this.dealData());
    //this.dealData();
    this.setBreadcrumb();
  }

  dealData(){
    this.dealProject();
    this.dealModulars();
  }

  dealProject(){
    const state = this.store.getState();
    this.project = state['project']['project'];
    if(!this.project||!this.project['account']){
      let id = sessionStorage.getItem('projectId');
      if(!id) return;
      this.projectService.getProjectById({ id: id})
        .then((data)=> {
          if(!data.length){
            this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent});
            return;
          }
          data = data[0];
          this.projectService.getLoginRelation(data['account'], {userAccount: this.login['account']})
            .then((relations) => {
              data['relations'] = relations;
              let writer = this.login['role'] === 'admin' ? 'writer' : 'notwriter';
              if (this.login['role'] !== 'admin' && relations) {
                relations.forEach((item) => {
                  switch (item['relation']) {
                    case 'leader':
                    case 'writer':
                      writer = 'writer';
                      break;
                  }
                })
              }
              data['writable'] = writer;
              this.store.dispatch(ProjectActions.getCurProject(data));
            })
            .catch((err)=>{
              this._message.create('err',err.messge);
            })
        })
        .catch((err)=>{
          this._message.create('err',err.messge);
        })
    }
  }

  dealModulars(){
    if(!this.project||!this.project['account']){
      return;
    }
    const state = this.store.getState();
    this.modulars = state['modular']['modulars'];
    if(this.modulars.length){
      this.parent = this.modulars[this.modulars.length-1]['id'];
    }else{
      this.parent = sessionStorage.getItem('modularId');
      if(this.parent){
        this.getModular(this.parent);
      }
    }
  }

  getModular(parent){
    this.modularService.getModularById(this.project['account'],{ id: parent, login: this.login['account']})
    .then((modular)=>{
      if(modular){
        if(this.login['role']==='admin'||this.project['writable']==='writer'){
          modular['writable'] = 'writer';
        }
        this.store.dispatch(ModularActions.getParentModular(modular));
        if(modular['parent']){
          this.getModular(modular['parent']);
        }
      }
    })
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.store.dispatch(ProjectActions.getCurProject({}));
    sessionStorage.removeItem('projectId');
    this.store.dispatch(ModularActions.clearModular());
    sessionStorage.removeItem('modularId');
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
    this.modal = this.modalService.open({
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
            this.modal.destroy('onOk');
            this.isConfirmLoading = false;
            this.modal = null;
            sessionStorage.removeItem('projectId');
            this.store.dispatch(ProjectActions.getCurProject({}));
            this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent});
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
            this.modal.destroy('onOk');
            this.isConfirmLoading = false;
            this.modal = null;
            sessionStorage.removeItem('projectId');
            this.store.dispatch(ProjectActions.getCurProject({}));
            this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent});
          })
          .catch((err)=>{
            this._message.create('error',err.mesage);
            reject();
          })
      })
    }
  }

}
