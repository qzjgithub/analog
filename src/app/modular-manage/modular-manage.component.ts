import { Component, OnInit,Inject } from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppStore} from "../../control/app.store";
import {Store} from "redux";
import {AppState} from "../../control/app.reducer";
import {Router, ActivatedRoute} from "@angular/router";
import {ModularService} from "../../control/modular/modular.service";
import {ConfigService} from "../../control/config/config.service";
import {NzMessageService} from "ng-zorro-antd";

import * as ProjectActions from '../../control/project/project.action';
import * as ModularActions from '../../control/modular/modular.action';

@Component({
  selector: 'app-modular-manage',
  templateUrl: './modular-manage.component.html',
  styleUrls: ['./modular-manage.component.css']
})
export class ModularManageComponent implements OnInit {
  scope = 'modular';

  login: any;

  project : any;

  parent: any;

  modular: any;

  data: Array<any>;
  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private _message: NzMessageService,
    private configService: ConfigService,
    private modularService: ModularService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.data = [];
    this.login = this.configService.getStateLogin();
    this.store.subscribe(()=>this.dealProject());
    this.setBreadcrumb();
    this.dealProject();

  }

  ngOnInit() {
  }

  getList(){
    if(!this.project['account']) return;
    switch(this.scope){
      case 'modular':
        this.getModular();
        break;
    }
  }

  getModular(){
    this.modularService.getModular(this.project['account'],{ parent: this.parent, login : this.login['account']})
      .then((data)=>{
        data.map((item)=>{
          item['writable'] = (this.project['writable']==='writer' ||(this.modular && this.modular['writable']==='writer')|| item['writable'] === 'writer') ? 'writer':'notwriter';
          let tags = [];
          if(item['writable']==='writer'){
            tags.push( { active : true, text: '可编写'});
          }else{
            tags.push( { active : false, text: '不可写'});
          }
          if(item['concern']==='concern'){
            tags.push( { active : true, text: '已关注'});
          }else if(this.login['account']!==this.project['leader']){
            tags.push( { active : false, text: '未关注'});
          }
          item['tags'] = tags;
          let content = [];
          content.push({ label: '路径', value: item['url']});
          content.push({ label: '创建时间', value: this.getDate(Number(item['createdTime']))});
          content.push({ label: '备注信息', value: item['comment']});
          item['content'] = content;
        })
        this.data = data;
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  dealProject(){
    const state = this.store.getState();
    this.project = state['project']['project'];
    this.modular = state['modular']['modular'];
    this.parent = this.modular['id'];
    this.getList();
  }

  changeScope(){
    this.getList();
  }

  setBreadcrumb(){
    if(this.parent){
      this.store.dispatch(ConfigActions.setBreadcrumbsAction(['模块管理'],3));
    }
  }

  getDate(data){
    let date = new Date(data);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }

  addModular(e){
    this.router.navigate([{outlets: {'modular': 'addModular'}}],{relativeTo: this.route.parent});
  }

  backParent(){
    if(!this.parent){
      sessionStorage.removeItem('projectId');
      this.store.dispatch(ProjectActions.getCurProject({}));
      this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent.parent});
    }
  }

  modifyModular(data){}

  childModular(data){
    sessionStorage.setItem('modularId',data['id']);
    this.store.dispatch(ModularActions.getCurModular(data));
  }

}
