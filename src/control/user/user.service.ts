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
    return userService.getUserById(data);
  }

  /**
   * 修改用户
   * @param data
   * @returns {Promise<T>}
   */
  modifyUser = (data) => {
    return userService.modifyUser(data);
  }

  /**
   * 根据旧密码修改密码
   * @param data
   * @returns {any}
   */
  modifyPwdWithOld = (data) => {
    return userService.modifyPwdWithOld(data);
  }

  /**
   * 获取所有非管理员的用户列表
   * @returns {any|undefined}
   */
  getUserList = () => {
    return userService.getUserList();
  }

  /**
   * 批量重置密码
   * @param data
   */
  resetPwd = (data) => {
    const state = this.store.getState();
    let pwd = state['config']['config']['defaultPwd'];
    return userService.modifyPwdUser({id: data, active: false, password: pwd})
  }

  /**
   * 根据用户account得到用户的名字
   */
  getUserByAccount = (data) => {
    return userService.getUserByAccount(data);
  }

}

export const USER_PROVIDERS: Array<any> = [
  { provide: UserService, useClass: UserService }
];
