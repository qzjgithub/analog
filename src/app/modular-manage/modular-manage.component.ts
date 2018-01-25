import { Component, OnInit,Inject } from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppStore} from "../../control/app.store";
import {Store} from "redux";
import {AppState} from "../../control/app.reducer";

@Component({
  selector: 'app-modular-manage',
  templateUrl: './modular-manage.component.html',
  styleUrls: ['./modular-manage.component.css']
})
export class ModularManageComponent implements OnInit {
  scope = 'modular';

  project : any;
  constructor(
    @Inject(AppStore) private store: Store<AppState>
  ) {
    this.store.subscribe(()=>this.dealProject());
    this.setBreadcrumb();
  }

  ngOnInit() {
  }

  dealProject(){
    const state = this.store.getState();
    this.project = state['project']['project'];
  }

  changeScope(){}

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['模块管理'],3));
  }

  getDate(data){
    let date = new Date(data);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }

  addModular(){}

}
