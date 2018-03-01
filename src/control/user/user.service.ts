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
import {ConfigService} from "../config/config.service";
import axios from 'axios';

@Injectable()
export class UserService{
  constructor(@Inject(AppStore) private store: Store<AppState>,
              private configService: ConfigService){}

  /**
   * 验证登录是否成功
   * @param param
   * @returns {any}
   */
  validLogin = (param)=>{
    return new Promise((resolve, reject) => {
      let config = this.configService.getStateConfig();
      if(config['openRemote']){
        axios.post(this.configService.getUrl(config)+'/user/login',param)
          .then((data) => {
            this.store.dispatch(ConfigActions.getLogin(data));
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      }else{
        userService.validLoginUser(param)
          .then((data) => {
            this.store.dispatch(ConfigActions.getLogin(data));
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      }
    });
  }

  /**
   * 得到用户相关选项
   * @returns {any}
   */
  getSelect = () =>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+'/user/select')
        .then((data) => {
          resolve(data);
        })
        .catch((err)=>{
          reject(err);
        })
      });
    }else{
      return getUserSelect();
    }
  }

  /**
   * 添加用户
   * @returns {any}
   */
  add = (data) =>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.post(this.configService.getUrl(config)+'/user',data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.addUser(data);
    }
  }

  /**
   * 验证该账号是否存在
   * @param data
   * @returns {any}
   */
  validExist = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+'/user/exist?account='+data['account'])
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.validExistUser(data);
    }
  }

  /**
   * 修改密码
   * @param data
   * @returns {any}
   */
  modifyPwd = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.put(this.configService.getUrl(config)+'/user/password',data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.modifyPwdUser(data);
    }
  }

  /**
   * 根据id获取用户
   * @param data
   * @returns {any}
   */
  getUserById = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+'/user/'+data['id'])
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.getUserById(data);
    }
  }

  /**
   * 修改用户
   * @param data
   * @returns {Promise<T>}
   */
  modifyUser = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.put(this.configService.getUrl(config)+'/user',data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.modifyUser(data);
    }
  }

  /**
   * 根据旧密码修改密码
   * @param data
   * @returns {any}
   */
  modifyPwdWithOld = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.put(this.configService.getUrl(config)+'/user/oldPwd',data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.modifyPwdWithOld(data);
    }
  }

  /**
   * 获取所有非管理员的用户列表
   * @returns {any|undefined}
   */
  getUserList = () => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+'/user')
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.getUserList();
    }
  }

  /**
   * 批量重置密码
   * @param data
   */
  resetPwd = (data) => {
    const state = this.store.getState();
    let pwd = state['config']['config']['defaultPwd'];
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.put(this.configService.getUrl(config)+'/user/reset',{id: data, active: false, password: pwd})
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.modifyPwdUser({id: data, active: false, password: pwd});
    }
  }

  /**
   * 根据用户account得到用户的名字
   */
  getUserByAccount = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+'/user/account?account='+data['account'])
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.getUserByAccount(data);
    }
  }

  /**
   * 得到可添加的可写用户
   * @param account
   */
  getWritableUser = (account)=>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+'/user/writer?account='+account)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return userService.getWritableUser(account);
    }
  }

}

export const USER_PROVIDERS: Array<any> = [
  { provide: UserService, useClass: UserService }
];
