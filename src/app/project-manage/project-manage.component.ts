import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigService} from "../../control/config/config.service";
import {ProjectService} from "../../control/project/project.service";
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

  /*tags = [{active:true,text:'公开'},{active:false,text:'无关'},{active:true,text:'已启动'},{}]

  content = [{label:'代号',value:'MM001'},{label:'负责人',value:'王小二'},{label:'端口',value:'8085'},{label:'创建时间',value:'2017-10-31'}]*/

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private configService: ConfigService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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
    this.router.navigate([{outlets: {'content': 'addProject'}}],{relativeTo: this.route.parent})
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

  modifyProject(data){
    console.log(data);
  }

}
