import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";

@Component({
  selector: 'app-analog-manage',
  templateUrl: './analog-manage.component.html',
  styleUrls: ['./analog-manage.component.css']
})
export class AnalogManageComponent implements OnInit {

  constructor(
    @Inject(AppStore) private store: Store<AppState>
  ) {
    this.setBreadcrumb();
  }

  ngOnInit() {
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情','模拟数据'],1));
  }

}
