/**
 * Created by admin on 2018/2/11.
 */
import {Injectable} from "@angular/core";
import * as analogService from "../../../service/analog/analog";
import { getAnalogSelect } from "../../../service/selectList/selectList";
@Injectable()
export class AnalogService{
  /**
   * 得到添加选择项
   * @returns {any}
   */
  getSelect(){
    return getAnalogSelect();
  }

  /**
   * 添加模拟数据
   * @param account
   * @param data
   * @returns {any|undefined}
   */
  addAnalog(account,data){
    return analogService.addAnalog(account,data);
  }

  /**
   * 根据接口id获取模拟数据
   * @param account
   * @param id
   */
  getAnalogByParent(account,id){
    return analogService.getAnalogByParent(account,id);
  }

  /**
   * 根据模拟数据id删除模拟数据
   */
  deleteAnalogById(account,id){
    return analogService.deleteAnalogById(account,id);
  }
}

export const ANALOG_PROVIDERS: Array<any> = [
  { provide: AnalogService, useClass: AnalogService }
];
