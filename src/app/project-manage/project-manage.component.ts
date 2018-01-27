import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import * as ProjectActions from '../../control/project/project.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigService} from "../../control/config/config.service";
import {ProjectService} from "../../control/project/project.service";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.component.html',
  styleUrls: ['./project-manage.component.css']
})
export class ProjectManageComponent implements OnInit {

  scope = 'public';

  login: any;

  project : Array<any>;

  related : Object;

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private configService: ConfigService,
    private projectService: ProjectService,
    private modalService: NzModalService,
    private _message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.scope = sessionStorage.getItem('projectScope')||'public';
    this.login = this.configService.getStateLogin();
    this.project = [];
    this.related = {};
    this.setBreadcrumb();
    this.getProejct();
  }

  ngOnInit() {
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理'],1));
  }

  addProject(e){
    this.router.navigate([{outlets: {'content': 'addProject'}}],{relativeTo: this.route.parent});
  }

  getProejct(){
    let param = { login: this.login['account']};
    switch(this.scope){
      case 'leader':
      case 'related':
        param['relation'] = this.scope;
        break;
    }
    this.projectService.getProject(param)
      .then((data) =>{
        let project = [];
        if(data['project']){
          project = data['project'];
          this.related = data['related'] || {};
        }else {
          project = data;
        }
        project.map((item)=>{
          let tags = [];
          tags.push({ active : item['authority'] === 'public' , text : item['authority'] === 'public' ? '公开' : '私密'});
          let related = this.scope === 'public' ? !!this.related[item['account']] : true;
          tags.push({ active : related , text : related ? '相关' : '不相关'});
          tags.push({ active : false , text : '未启动'});
          item['tags'] = tags;

          let content = [];
          content.push({ label: '代号',value: item['account']});
          content.push({ label: '负责人',value: item['leader']});
          content.push({ label: '端口',value: item['port']});
          content.push({ label: '创建时间',value: this.getDate(item['createdTime'])});
          item['content'] = content;
          return item;
        });
        this.project = project;
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  getDate(data){
    let date = new Date(data);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }

  changeScope(value){
    sessionStorage.setItem('projectScope',this.scope);
    this.getProejct();
  }

  changeProjectState(data){
    let m = false;
    this.modalService.confirm({
      title   : '确认'+(m?'启动':'停止')+data.name+'项目吗？',
      content : '请确定项目的端口和路径设置正确。',
      closable: false,
      showConfirmLoading: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        return new Promise((resovle, reject)=>{
          this.projectService[m?'startProject':'stopProject'](data.account)
            .then(()=>{
              resovle();
            })
            .catch((err)=>{
              this._message.create('error',err.mesage);
              reject();
            })
        })
      }
    });
  }

  detailProject(data){
    this.projectService.getLoginRelation(data['account'],{userAccount: this.login['account']})
    .then((relations)=>{
      data['relations'] = relations;
      let write = this.login['role']==='admin' ? 'write' : 'nowrite';
      if(this.login['role']!=='admin' && relations){
        relations.forEach((item)=>{
          switch(item['relation']){
            case 'leader':
            case 'write':
              write = 'write';
              break;
          }
        })
      }
      data['write'] = write;
      this.store.dispatch(ProjectActions.getCurProject(data));
      sessionStorage.setItem('project',data);
      this.router.navigate([{outlets: {'content': 'project/'+data.id}}],{relativeTo: this.route.parent});
    })
    .catch((err)=>{
      this._message.create('error',err.message);
    })
  }

}
