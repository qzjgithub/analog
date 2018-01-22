import {Component, OnInit, Inject} from '@angular/core';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {ConfigService} from "../../control/config/config.service";
import {Router, ActivatedRoute} from "@angular/router";
import {UserService} from "../../control/user/user.service";
import {NzMessageService} from "ng-zorro-antd";

import * as ConfigActions from '../../control/config/config.action';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  /*styles  : [
    `:host ::ng-deep .logo {
      width: 120px;
      height: 31px;
      background: #333;
      border-radius: 6px;
      margin: 16px 28px 16px 0;
      float: left;
    }`
  ]*/
})
export class HomeComponent implements OnInit {
  login : any;
  userId : any;
  config: any;
  breadcrumbs: Array<any>;

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private _message: NzMessageService,
    private configService: ConfigService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.subscribe(()=>{
      this.login = configService.getStateLogin();
      this.getBreadCrumb();
    })
    this.login = {}
    this.config = configService.getStateConfig();
    this.initBreadCrumb();
    this.initCheckUser();
  }

  /**
   * 检查是否有登录有效的用户
   */
  initCheckUser(){
    this.login = this.configService.getStateLogin();
    this.userId = sessionStorage.getItem('userId');
    if(!this.userId){
      this.router.navigate(['loginManage']);
    }else if(this.login.active===undefined){
      this.userService.getUserById({ id: this.userId})
        .then((data)=>{
          this.store.dispatch(ConfigActions.getLogin(data));
        })
        .catch((err)=>{
          this.router.navigate(['loginManage']);
          sessionStorage.removeItem('userId');
          this._message.create('error','登录错误');
        })
    }
  }

  /**
   * 初始化面包屑
   */
  initBreadCrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(this.config['openRemote'] ? '远程服务系统' : '本地系统',0));
  }

  /**
   * 得到面包屑
   */
  getBreadCrumb(){
    const state = this.store.getState();
    this.breadcrumbs = state.config.breadcrumbs;
  }

  ngOnInit() {
  }

  /**
   * 登出
   * @param e
   * @returns {boolean}
   */
  loginout(e){
    this.configService.clearLogin();
    this.router.navigate(['loginManage']);
    return false;
  }

  /**
   * 进入个人中心
   */
  gotoPerson(){
    this.router.navigate([{outlets: {'content': 'person'}}],{relativeTo: this.route})
  }

  /**
   * 进入用户管理
   */
  gotoUser(){
    this.router.navigate([{outlets: {'content': 'user'}}],{relativeTo: this.route})
  }

  /**
   * 进入配置管理
   */
  gotoConfig(){
    this.router.navigate([{outlets: {'content': 'config'}}],{relativeTo: this.route})
  }

  /**
   * 进入项目管理
   */
  gotoProject(){
    this.router.navigate([{outlets: {'content': 'project'}}],{relativeTo: this.route})
  }

}
