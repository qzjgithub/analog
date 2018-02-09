/**
 * Created by admin on 2018/2/2.
 */
import {Injectable, Inject} from "@angular/core";
import * as interfacesService from "../../../service/interfaces/interfaces";
import { getInterfacesSelect } from "../../../service/selectList/selectList";
@Injectable()
export class InterfacesService{
  /**
   * 根据模块id得到接口信息
   * @param account
   * @param data
   * @returns {any}
   */
  getInterfacesByParent(account,data){
    return interfacesService.getInterfacesByParent(account,data);
  }

  /**
   * 得到某项目下的所有接口
   * @param account
   * @returns {any}
   */
  getInterfacesAll(account){
    return interfacesService.getInterfacesAll(account);
  }

  /**
   * 得到可选项
   * @param account
   * @returns {any}
   */
  getSelect(){
    return getInterfacesSelect();
  }

  /**
   * 添加接口
   * @param account
   * @param data
   */
  addInterfaces(account, data){
    return interfacesService.addInterfaces(account,data);
  }

  /**
   * 根据模块id得到其下接口的全路径
   * @param account
   * @param id
   * @returns {any}
   */
  getFullPathByModularId(account,id){
    return interfacesService.getFullPathByModularId(account,id,null,null);
  }

  /**
   * 根据id获得接口
   * @param account
   * @param data
   */
  getInterfacesById(account,data){
    return interfacesService.getInterfacesById(account,data);
  }

}

export const INTERFACES_PROVIDERS: Array<any> = [
  { provide: InterfacesService, useClass: InterfacesService }
];
