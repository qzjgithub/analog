import {Component, Inject} from '@angular/core';
import {ConfigService} from "../control/config/config.service";
import {Store} from "redux";
import {AppState} from "../control/app.reducer";
import {AppStore} from "../control/app.store";

import * as ConfigActions from '../control/config/config.action';
import {getConfigState} from "../control/config/config.reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   * 是否已经进入过系统
   * @type {boolean}
   */
  initFlag = false;

  /**
   * 进入系统的提示信息
   * @type {string}
   */
  tip = '正在进入系统';

  constructor(@Inject(AppStore) private store: Store<AppState>,private configService: ConfigService){
    store.subscribe(()=>this.updateInitFlag());
    configService.getConfig();
  }

  /**
   * 更新系统状态
   */
  updateInitFlag(){
    const state = this.store.getState();
    let config = getConfigState(state);
    this.initFlag = config.config['activeState'];
    this.tip = this.initFlag ? "":"第一次进入系统正在初始化，请稍后...";
  }
}
