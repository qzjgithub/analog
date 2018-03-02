/**
 * Created by qiuzhujun on 2018/1/28.
 */
import {Injectable, Inject} from "@angular/core";
import * as modularService from "../../../service/modular/modular";
import {ConfigService} from "../config/config.service";
import axios from 'axios';
@Injectable()
export class ModularService{
  constructor(private configService: ConfigService){}

  /**
   * 添加模块
   * @param account
   * @param data
     */
  addModular = (account,data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.post(this.configService.getUrl(config)+`/modular/${account}`,data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return modularService.addModular(account,data);
    }
  }

  /**
   * 得到模块列表信息
   * @param account
   * @param data
   * @returns {any}
   */
  getModular = (account,data) =>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)
          +`/modular/${account}?parent=${data['parent']||''}&login=${data['login']}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return modularService.getModular(account,data);
    }
  }

  /**
   * 根据ID获取模块信息
   * @param account
   * @param data
     */
  getModularById = (account,data)=>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)
            +`/modular/${account}/${data['id']}&login=${data['login']}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return modularService.getModularById(account,data);
    }
  }

  /**
   * 删除模块
   * @param account
   * @param data
   * @returns {any|undefined}
     */
  deleteModular = (account,data)=>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.delete(this.configService.getUrl(config)
            +`/modular/${account}/${data['id']}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return modularService.deleteModular(account,data);
    }
  }
}

export const MODULAR_PROVIDERS: Array<any> = [
  { provide: ModularService, useClass: ModularService }
];
