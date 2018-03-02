import { Component, OnInit,Inject } from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppStore} from "../../control/app.store";
import {Store} from "redux";
import {AppState} from "../../control/app.reducer";
import {Router, ActivatedRoute} from "@angular/router";
import {ModularService} from "../../control/modular/modular.service";
import {ConfigService} from "../../control/config/config.service";
import {NzModalService,NzMessageService} from "ng-zorro-antd";

import * as ProjectActions from '../../control/project/project.action';
import * as ModularActions from '../../control/modular/modular.action';
import * as InterfacesActions from '../../control/interfaces/interfaces.action';
import {UserService} from "../../control/user/user.service";
import {InterfacesService} from "../../control/interfaces/interfaces.service";

@Component({
  selector: 'app-modular-manage',
  templateUrl: './modular-manage.component.html',
  styleUrls: ['./modular-manage.component.css']
})
export class ModularManageComponent implements OnInit {
  /**
   * 当前展示的内容类型
   */
  scope:string;

  /**
   * 当前页面是否处于管理模式
   */
  manage:boolean;

  /**
   * 登录的用户信息
   */
  login: any;

  /**
   * 当前项目信息
   */
  project : any;

  /**
   * 当前负模块id
   */
  parent: any;

  /**
   * 当前模块信息
   */
  modular: any;

  /**
   * 当前展示的具体内容数据
   */
  data: Array<any>;

  /**
   * 被选中的数据的id
   */
  selectedId: Array<any>;
  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private _message: NzMessageService,
    private configService: ConfigService,
    private userService:UserService,
    private modularService: ModularService,
    private interfacesService: InterfacesService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.scope = sessionStorage.getItem('modularScope')||'modular';
    this.manage = false;
    this.data = [];
    this.selectedId = [];
    this.parent = sessionStorage.getItem('modularId');
    this.login = this.configService.getStateLogin();
    this.store.subscribe(()=>this.dealProject());
    this.dealProject();
    this.getList();
    this.setBreadcrumb();
  }

  ngOnInit() {
  }

  getList(){
    if(!this.project['account']) return;
    switch(this.scope){
      case 'modular':
        this.getModular();
        break;
      case 'interfaces':
        this.getInterfaces();
        break;
      case 'allInterfaces':
        this.getInterfacesAll();
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

  getInterfaces(){
    this.interfacesService.getInterfacesByParent(this.project['account'],{ parent: this.parent})
      .then((data)=>{
        this.data = data;
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  getInterfacesAll(){
    this.interfacesService.getInterfacesAll(this.project['account'])
      .then((data)=>{
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
    // this.getList();
  }

  changeScope(){
    sessionStorage.setItem('modularScope',this.scope);
    this.data = [];
    this.selectedId = [];
    this.getList();
    this.setBreadcrumb();
  }

  setBreadcrumb(){
    if(this.parent){
      let name = '';
      switch(this.scope){
        case 'modular':
          name = '模块管理';
          break;
        case 'interfaces':
          name = '接口管理';
          break;
        case 'allInterfaces':
          name = '接口管理';
          break;
        case 'user':
          name = '用户管理';
          break;
      }
      this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情',name],1));
    }else{
      this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情'],1));
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
    this.manage = false;
    this.scope = 'modular';
    sessionStorage.setItem('modularScope','modular');
    if(!this.parent){
      sessionStorage.removeItem('projectId');
      this.store.dispatch(ProjectActions.getCurProject({}));
      this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent.parent});
    }else{
      this.data = [];
      this.store.dispatch(ModularActions.backLastModular());
      this.setBreadcrumb();
      this.getList();
    }
  }

  modifyModular(data){}

  childModular(data){
    this.userService.getUserByAccount({ account: data['creator']})
    .then((user)=>{
      if(user.length){
        data['creatorName'] = user[0]['name'];
      }else{
        data['creatorName'] = '未知';
      }
      sessionStorage.setItem('modularId',data['id']);
      this.store.dispatch(ModularActions.getCurModular(data));
      this.setBreadcrumb();
      this.getList();
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  addInterfaces(e){
    this.router.navigate([{outlets: {'modular': 'addInterfaces'}}],{relativeTo: this.route.parent})
  }

  gotoAnalog(d){
    if(!this.manage){
      sessionStorage.setItem('interfacesId',d['id']);
      // this.store.dispatch(InterfacesActions.getCurInterfaces(d));
      this.router.navigate([{outlets: {'modular': 'analog'}}],{relativeTo: this.route.parent})
    }else{
      let id = d['id'];
      let index = this.selectedId.indexOf(id);
      if(index>-1){
        this.selectedId.splice(index,1);
      }else{
        this.selectedId.push(id);
      }
    }
  }

  changeManage(e){
    this.manage = !this.manage;
    this.selectedId = [];
  }

  deleteInterfaces(e){
    e.stopPropagation();
    if(!this.selectedId.length){
      this._message.create('warning','请至少选择一条数据')
    }
    const modal = this.modalService.confirm({
      title   : '删除接口',
      content : '如果该接口下存在模拟数据，模拟数据将被一起删除，确认删除吗？',
      closable: false,
      showConfirmLoading: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        return new Promise((resolve,reject)=>{
          this.interfacesService.deleteInterfacesInIds(this.project['account'],this.selectedId)
            .then(()=>{
              resolve();
              this.getList();
            })
            .catch((err)=>{
              this._message.create('error',err.message);
              resolve();
            })
        })
      }
    })
  }

}
