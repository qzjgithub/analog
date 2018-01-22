/**
 * Created by admin on 2018/1/10.
 */
import {Injectable, Inject} from "@angular/core";
import {getConfigBack, initSystem, setConfig} from '../../../service/config/config';
import {Store} from "redux";
import {AppStore} from "../app.store";
import {AppState} from "../app.reducer";

import * as ConfigActions from './config.action';
import {getConfigState} from "./config.reducer";

@Injectable()
export class ConfigService{
  constructor(@Inject(AppStore) private store: Store<AppState>){}

  /**
   * 得到state中的config
   * @returns {any}
   */
  getStateConfig = ()=>{
    const state = this.store.getState();
    let config = getConfigState(state);
    return config['config'];
  }

  /**
   * 得到state中的login
   * @returns {any}
   */
  getStateLogin = ()=>{
    const state = this.store.getState();
    let config = getConfigState(state);
    return config['login'];
  }

  /**
   * 得到config信息
   */
  getConfig = ()=>{
    getConfigBack()
      .then((data)=>{
        this.store.dispatch(ConfigActions.getConfig(data));
        if(!data['activeState']){
          initSystem(data)
            .then((newdata)=>{
              this.store.dispatch(ConfigActions.getConfig(newdata));
            })
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  /**
   * 设置config信息
   * @param data
   * @returns {Promise<T>}
   */
  setConfig(data){
    return new Promise((resolve, reject)=>{
      setConfig(data)
        .then((newdata) => {
          this.store.dispatch(ConfigActions.getConfig(newdata));
          resolve(newdata);
        })
        .catch((err)=>{
          console.log(err);
          reject(err);
        });
    })
  }
  /**
   * 设置远程服务信息
   * @param data
   */
  setRemoteService = (data)=>{
    let config = this.getStateConfig();
    let { address, port, prefix } = data;

    config['remoteService'] = { address, port, prefix } ;
    config['openRemote'] = data['remoteServer'];
    return this.setConfig(config);
  }

  /**
   * 设置远程服务的开启和关闭状态
   * @param data
   */
  setOpenRemote = (data)=>{
    let config = this.getStateConfig();
    config['openRemote'] = data;
    return this.setConfig(config);
  }

  /**
   * 清空登录用户信息
   */
  clearLogin = ()=>{
    sessionStorage.removeItem('userId');
    this.store.dispatch(ConfigActions.getLogin({}));
  }

  /**
   * 设置基本信息
   * @param data
   * @returns {Promise<T>}
   */
  setBaseInfo = (data) => {
    let config = this.getStateConfig();
    config = Object.assign(config, data);
    return this.setConfig(config);
  }

  /**
   * 设置基本信息
   * @param data
   * @returns {Promise<T>}
   */
  setOutBox = (data) => {
    let config = this.getStateConfig();
    config['outbox'] = data;
    return this.setConfig(config);
  }

  /**
   * 设置本地服务配置信息
   * @param data
   */
  setLocalService = (data) => {
    let config = this.getStateConfig();
    config['localService'] = data;
    return this.setConfig(config);
  }
}

export const CONFIG_PROVIDERS: Array<any> = [
  { provide: ConfigService, useClass: ConfigService }
];
