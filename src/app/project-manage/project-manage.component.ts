import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-project-manage',
  templateUrl: './project-manage.component.html',
  styleUrls: ['./project-manage.component.css']
})
export class ProjectManageComponent implements OnInit {

  scope = 'all';

  tags = [{active:true,text:'公开'},{active:false,text:'无关'},{active:true,text:'已启动'},{}]

  content = [{label:'代号',value:'MM001'},{label:'负责人',value:'王小二'},{label:'端口',value:'8085'},{label:'创建时间',value:'2017-10-31'}]

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setBreadcrumb();
  }

  ngOnInit() {
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理'],1));
  }

  addProject(e){
    this.router.navigate([{outlets: {'content': 'addProject'}}],{relativeTo: this.route.parent})
  }

}
