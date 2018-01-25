import {Component, OnInit, Inject} from '@angular/core';
import {AppStore} from "../../control/app.store";
import {Store} from "redux";
import {AppState} from "../../control/app.reducer";

import * as ConfigActions from '../../control/config/config.action';
import {Router, ActivatedRoute} from "@angular/router";
import {UserService} from "../../control/user/user.service";
import {ConfigService} from "../../control/config/config.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  _allChecked = false;
  _indeterminate = false;
  _displayData = [];

  data = [];

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private _message: NzMessageService,
    private modalService: NzModalService,
    private configService: ConfigService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setBreadcrumb();
    this.getUserList();
  }

  getUserList(){
    this.userService.getUserList()
      .then((data) => {
        this.data = data;
      })
      .catch((err)=>{
        this._message.create('error',err.text);
      })
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['用户管理'],1));
  }

  ngOnInit() {
    this.userService.getUserList()
  }

  _displayDataChange($event) {
    this._displayData = $event;
    this._refreshStatus();
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    console.log(this._allChecked, this._indeterminate);
  }

  _checkAll(value) {
    if (value) {
      this._displayData.forEach(data => {
        data.checked = true;
      });
    } else {
      this._displayData.forEach(data => {
        data.checked = false;
      });
    }
    this._refreshStatus();
  }

  getDate(value){
    let d = new Date(value);
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }

  addUser(){
    this.router.navigate([{outlets: {'content': 'addUser'}}],{relativeTo: this.route.parent})
  }

  resetPwd(data){
    const modal = this.modalService.confirm({
      title   : '确认重置'+data.name+'的密码吗？',
      content : '重置密码后用户将变为“未激活”状态，需用户重新登录修改密码后激活。',
      closable: false,
      showConfirmLoading: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        return new Promise((resovle, reject)=>{
          this.userService.resetPwd(data.id)
            .then(()=>{
              this.getUserList();
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
}
