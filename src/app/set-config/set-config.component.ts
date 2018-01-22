import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";

@Component({
  selector: 'app-set-config',
  templateUrl: './set-config.component.html',
  styleUrls: ['./set-config.component.css'],
  host: {
      style : 'display: block;width: 60%;'
  }
})
export class SetConfigComponent implements OnInit {

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
  ) {
    this.setBreadcrumb();
  }

  ngOnInit() {
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction('配置管理',1));
  }

}
