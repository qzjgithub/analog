import { Component, OnInit,Inject } from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppStore} from "../../control/app.store";
import {Store} from "redux";
import {AppState} from "../../control/app.reducer";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-modular-manage',
  templateUrl: './modular-manage.component.html',
  styleUrls: ['./modular-manage.component.css']
})
export class ModularManageComponent implements OnInit {
  scope = 'modular';

  project : any;

  parent: any;
  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.subscribe(()=>this.dealProject());
    this.setBreadcrumb();
    this.dealProject();
  }

  ngOnInit() {
  }

  dealProject(){
    const state = this.store.getState();
    this.project = state['project']['project'];
  }

  changeScope(){}

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
      this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route.parent.parent});
    }
  }

}
