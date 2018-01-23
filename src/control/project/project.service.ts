/**
 * Created by admin on 2018/1/23.
 */
import { getProjectSelect } from "../../../service/selectList/selectList";
import { getUserList } from "../../../service/user/user";
import {Injectable, Inject} from "@angular/core";
import {AppState} from "../app.reducer";
import {Store} from "redux";
import {AppStore} from "../app.store";

import * as projectService from "../../../service/project/project";


@Injectable()
export class ProjectService{
  constructor(@Inject(AppStore) private store: Store<AppState>){}

  /**
   * 得到项目选项
   * @returns {any}
   */
  getSelect = (param)=>{
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

  /**
   * 添加项目
   */
  add  = (data) => {
    return projectService.addProject(data);
  }
}

export const PROJECT_PROVIDERS: Array<any> = [
  { provide: ProjectService, useClass: ProjectService }
];
