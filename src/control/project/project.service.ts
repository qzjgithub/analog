/**
 * Created by admin on 2018/1/23.
 */
import { getProjectSelect } from "../../../service/selectList/selectList";
import { getUserList } from "../../../service/user/user";
import {Injectable, Inject} from "@angular/core";
import {AppState} from "../app.reducer";
import {Store} from "redux";
import {AppStore} from "../app.store";
import axios from 'axios';

import * as projectService from "../../../service/project/project";
import * as simulateService from "../../../service/simulate/cprocess";
import {ConfigService} from "../config/config.service";


@Injectable()
export class ProjectService{
  constructor(private configService: ConfigService){}

  /**
   * 得到项目选项
   * @returns {any}
   */
  getSelect = (param)=>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      if(param['role']==='admin'){
        return new Promise((resolve,reject)=>{
          axios.get(this.configService.getUrl(config)+'/user')
            .then((users)=>{
              axios.get(this.configService.getUrl(config)+'/project/select')
                .then((data)=>{
                  data['users'] = users;
                  resolve(data);
                })
                .catch((err)=>{
                  reject(err);
                })
            })
            .catch((err)=>{
              reject(err);
            })
        });
      }else{
        return new Promise((resolve,reject)=>{
          axios.get(this.configService.getUrl(config)+'/project/select')
            .then((data)=>{
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        });
      }
    } else
    {
      if(param['role'] ==='admin'){
        return new Promise((resolve,reject)=>{
          getProjectSelect()
            .then((data)=>{
              getUserList()
                .then((users)=>{
                  data['users'] = users;
                  resolve(data);
                })
                .catch((err)=>{
                  reject(err);
                })
            })
            .catch((err)=>{
              reject(err);
            })
        })
      }else{
        return getProjectSelect();
      }
    }
  }

  /**
   * 添加项目
   */
  add  = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.post(this.configService.getUrl(config)+'/project',data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return projectService.addProject(data);
    }
  }

  /**
   * 得到项目信息
   * @param data
   */
  getProject = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        if(data['relation']==='leader'){
          axios.get(this.configService.getUrl(config)+'/project/leader?login='+data['login'])
            .then((data) => {
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        }else if(data['relation']==='related'){
          axios.get(this.configService.getUrl(config)+'/project/related?login='+data['login'])
            .then((data) => {
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        }else {
          axios.get(this.configService.getUrl(config)+'/project/public?login='+data['login'])
            .then((data) => {
              resolve(data);
            })
            .catch((err)=>{
              reject(err);
            })
        }
      });
    }else{
      if(data['relation']==='leader'){
        return projectService.getLeaderProject(data);
      }else if(data['relation']==='related'){
        return projectService.getRelatedProject(data);
      }else {
        return projectService.getPublicProject(data);
      }
    }
  }

  /**
   * 通过id得到项目信息
   * @param data
   */
  getProjectById = (data) =>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+'/project?id='+data['id'])
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return projectService.getProjectById(data);
    }
  }

  /**
   * 修改项目信息
   * @param data
   * @returns {any|undefined}
   */
  modifyProject = (data) => {
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.put(this.configService.getUrl(config)+'/project',data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return projectService.modifyProject(data);
    }
  }
  /**
   * 得到登录者和项目的关系
   */
  getLoginRelation = (account,data)=>{
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+`/project/${account}/relation?userAccount=${data['userAccount']}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return projectService.getLoginRelation(account,data);
    }
  }

  /**
   * 删除项目
   */
  deleteProject(account,del){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.delete(this.configService.getUrl(config)+`/project/${account}`,del)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return projectService.deleteProject(account,del);
    }
  }

  /**
   * 启动模拟服务
   * @param account
   * @returns {any}
   */
  startAnalogService(account){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        reject({message:'连接远程服务时，不能启动项目'});
      });
    }else{
      return simulateService.startAnalogService(account);
    }
  }

  /**
   * 停止模拟服务
   * @param account
   * @returns {any|undefined}
   */
  stopAnalogService(account){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        reject({message:'连接远程服务时，不能停止项目'});
      });
    }else{
      return simulateService.stopAnalogService(account);
    }
  }
}

export const PROJECT_PROVIDERS: Array<any> = [
  { provide: ProjectService, useClass: ProjectService }
];
