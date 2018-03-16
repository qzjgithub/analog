/**
 * Created by admin on 2018/1/23.
 */
import { getProjectSelect } from "../../../service/selectList/selectList";
import { getUserList } from "../../../service/user/user";
import {Injectable, Inject} from "@angular/core";
import {AppState} from "../app.reducer";
import {Store} from "redux";
import {AppStore} from "../app.store";
import {HttpClient} from "@angular/common/http";
import axios from 'axios';

import * as projectService from "../../../service/project/project";
import * as simulateService from "../../../service/simulate/cprocess";
import {ConfigService} from "../config/config.service";
import {Observable} from "rxjs/Observable";


@Injectable()
export class ProjectService{
  constructor(private configService: ConfigService,private http: HttpClient){}

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

  //Blob请求
  requestBlob(url:any,data?:any):Observable<any>{
    return this.http.request("get",url,{body: data, observe: 'response',responseType:'blob'});
  }

  postFile(url:any,data?:any):Observable<any>{
  let params={
      "filelen":"1",//文件长度，预留，填常量“1”
      "filetype":"db",
      "base64fill":data
    }
    return this.http.request('post',url, {body: data});
  }
  //Blob文件转换下载
  downFile(result,fileName,fileType?){
    var data=result.body;
    var blob = new Blob([data], {type: fileType||data.type});
    var objectUrl = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    a.setAttribute('href', objectUrl);
    a.setAttribute('download', fileName);
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  testDown(account){
    let url = this.configService.getUrl(this.configService.getStateConfig())+`/project/${account}/download`;
    this.requestBlob(url).subscribe(result => {
      //this.downFile(result,fileName,fileType||"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      this.downFile(result,'storage.db');
    })
  }

  /**
   * 得到本地项目在项目中的存在情况
   * @param account
   * @returns {any}
     */
  getLocalProjectExists = (account)=>{
    return projectService.getProjectExists(account);
  }

  /**
   * 同步项目基本信息
   * @param account
     */
  downloadProject = (account)=>{
    let config = this.configService.getStateConfig();
    let prefix = this.configService.getUrl(config);
    return new Promise((resolve, reject) => {
      axios.get(`${prefix}/project/${account}`)
        .then((data) => {
          if(data['length']){
            projectService.writeProject(account,data[0])
            .then(()=>{
              axios.get(`${prefix}/project/${account}/projectUser`)
                .then((users) => {
                  projectService.writeProjectUser(account,users,0,null)
                    .then(() => {
                      resolve();
                    })
                    .catch((err)=>{
                      reject({message:'添加项目用户失败',result:'addProjectUserFailed'});
                    })
                })
                .catch((err)=>{
                  reject({message:'获取项目用户失败',result:'projectUserFailed'});
                })
            }).catch((err)=>{
              reject(err);
            })
          }else{
            reject({message:'未找到项目内容'})
          }
        })
        .catch((err)=>{
          reject(err);
        })
    });
  }

  uploadProject = (account)=>{
    let config = this.configService.getStateConfig();
    let prefix = this.configService.getUrl(config);
    return new Promise((resolve, reject) => {
      projectService.getProjectByAccount(account)
      .then((project)=>{
        if(project.length){
          project = project[0];
          axios.post(`${prefix}/project/${account}/write`,project)
            .then(() => projectService.getProjectUser(account))
            .then((projectUsers)=>{
              axios.post(`${prefix}/project/${account}/writeUser`,projectUsers)
                .then(()=>{
                  resolve();
                })
                .catch((err)=>{
                  reject(err);
                })
            })
            .catch((err)=>{
              reject(err);
            })
        }else{
            reject({message:'未找到项目内容'})
          }
      })
      .catch((err)=>{
        reject(err);
      })
    })
  }

  /**
   * 下载远程文件
   * @param account
     */
  downloadProjectFiles = (account)=>{
    let config = this.configService.getStateConfig();
    return new Promise((resolve, reject) => {
      axios.get(this.configService.getUrl(config)+`/project/${account}/files`)
        .then((files) => {
          this.writeProjectFile(account,files,0,resolve);
        })
        .catch((err)=>{
          reject(err);
        })
    });
  }

  /**
   * 写文件内容
   * @param account
   * @param files
   * @param index
   * @param theres
     */
  writeProjectFile = (account,files,index,theres)=>{
    if(index>=files.length){
      theres();
    }else{
      let fileName = files[0];
      let url = this.configService.getUrl(this.configService.getStateConfig())
        +`/project/${account}/file?fileName=${fileName}`;
      this.requestBlob(url).subscribe(result => {
        projectService.writeLocalFile(account,fileName,result['body'])
        .then(()=>{
          index++;
          this.writeProjectFile(account,files,index,theres);
        })
        .catch((err)=>{
          theres({result:'writeFileFailed',message:'写文件失败'})
        })
      })
    }
  }


  uploadProjectFiles = (account)=>{
    let config = this.configService.getStateConfig();
    return new Promise((resolve, reject) => {
     projectService.getFiles(account)
        .then((files) => {
          this.uploadProjectFile(account,files,0,resolve);
        })
        .catch((err)=>{
          reject(err);
        })
    });
  }

  uploadProjectFile = (account,files,index,theres)=>{
    if(index>=files.length){
      theres();
    }else{
      let fileName = files[0];
      let url = this.configService.getUrl(this.configService.getStateConfig())
        +`/project/${account}/file`;
      projectService.getFileContent(account,fileName)
        .then((content)=>{
          this.postFile(url+'?fileName='+fileName,content)
            .subscribe(() => {
              index++;
              this.uploadProjectFile(account,files,index,theres);
            })
            /*.catch((err)=>{
              theres(err);
            })*/
        })
        .catch((err)=>{
          theres(err);
        })
    }
  }

  getRemoteProjectExists = (account)=>{
    let config = this.configService.getStateConfig();
    return new Promise((resolve, reject) => {
      axios.get(this.configService.getUrl(config)+`/project/${account}/exists`)
        .then((files) => {
          resolve();
        })
        .catch((err)=>{
          reject(err);
        })
    });
  }
}

export const PROJECT_PROVIDERS: Array<any> = [
  { provide: ProjectService, useClass: ProjectService }
];
