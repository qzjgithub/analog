/**
 * Created by admin on 2018/1/9.
 */
import {Injectable, Inject} from "@angular/core";
import * as userService from "../../../service/user/user";
import { getUserSelect } from "../../../service/selectList/selectList";

import * as ConfigActions from '../config/config.action';
import {AppStore} from "../app.store";
import {Store} from "redux";
import {AppState} from "../app.reducer";

@Injectable()
export class UserService{
  constructor(@Inject(AppStore) private store: Store<AppState>){}

  /**
   * 验证登录是否成功
   * @param param
   * @returns {any}
   */
  validLogin = (param)=>{
    return new Promise((resolve, reject) => {
      userService.validLoginUser(param)
        .then((data) => {
          this.store.dispatch(ConfigActions.getLogin(data));
          resolve(data);
        })
        .catch((err)=>{
          reject(err);
        })
    });
  }

  /**
   * 得到用户相关选项
   * @returns {any}
   */
  getSelect = () =>{
    return getUserSelect();
  }

  /**
   * 添加用户
   * @returns {any}
   */
  add = (data) =>{
    return userService.addUser(data);
  }

  /**
   * 验证该账号是否存在
   * @param data
   * @returns {any}
   */
  validExist = (data) => {
    return userService.validExistUser(data);
  }

  /**
   * 修改密码
   * @param data
   * @returns {any}
   */
  modifyPwd = (data) => {
    return userService.modifyPwdUser(data);
  }

  /**
   * 根据id获取用户
   * @param data
   * @returns {any}
   */
  getUserById = (data) => {
    return new Promise((resolve, reject) => {
      userService.getUserById(data)
        .then((data) => {
          this.store.dispatch(ConfigActions.getLogin(data));
          resolve(data);
        })
        .catch((err)=>{
          reject(err);
        })
    });
  }

}

export const USER_PROVIDERS: Array<any> = [
  { provide: UserService, useClass: UserService }
];
