/**
 * Created by admin on 2018/2/2.
 */
import {Injectable} from "@angular/core";
import * as interfacesService from "../../../service/interfaces/interfaces";
import { getInterfacesSelect } from "../../../service/selectList/selectList";
import {ConfigService} from "../config/config.service";
import axios from 'axios';
@Injectable()
export class InterfacesService{

  constructor(private configService: ConfigService){}
  /**
   * 根据模块id得到接口信息
   * @param account
   * @param data
   * @returns {any}
   */
  getInterfacesByParent(account,data){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+`/interfaces/${account}?parent=${data['parent']||''}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return interfacesService.getInterfacesByParent(account,data);
    }
  }

  /**
   * 得到某项目下的所有接口
   * @param account
   * @returns {any}
   */
  getInterfacesAll(account){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+`/interfaces/${account}/all`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return interfacesService.getInterfacesAll(account);
    }
  }

  /**
   * 得到可选项
   * @param account
   * @returns {any}
   */
  getSelect(){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+`/interfaces/select`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return getInterfacesSelect();
    }
  }

  /**
   * 添加接口
   * @param account
   * @param data
   */
  addInterfaces(account, data){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.post(this.configService.getUrl(config)+`/interfaces/${account}`,data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return interfacesService.addInterfaces(account,data);
    }
  }

  /**
   * 根据模块id得到其下接口的全路径
   * @param account
   * @param id
   * @returns {any}
   */
  getFullPathByModularId(account,id){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+`/interfaces/${account}/fullPath?id=${id}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return interfacesService.getFullPathByModularId(account,id,null,null);
    }
  }

  /**
   * 根据id获得接口
   * @param account
   * @param data
   */
  getInterfacesById(account,data){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)
          +`/interfaces/${account}/list?id=${data['id']}&login=${data['login']}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return interfacesService.getInterfacesById(account,data);
    }
  }

  /**
   * 删除接口
   * @param account
   * @param data
   * @returns {any}
     */
  deleteInterfacesInIds(account,data){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.put(this.configService.getUrl(config)
            +`/interfaces/${account}`,data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return interfacesService.deleteInterfacesInIds(account,data);
    }
  }

}

export const INTERFACES_PROVIDERS: Array<any> = [
  { provide: InterfacesService, useClass: InterfacesService }
];
