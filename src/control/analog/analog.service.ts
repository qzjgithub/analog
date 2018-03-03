/**
 * Created by admin on 2018/2/11.
 */
import {Injectable} from "@angular/core";
import * as analogService from "../../../service/analog/analog";
import { getAnalogSelect } from "../../../service/selectList/selectList";
import axios from 'axios';
import {ConfigService} from "../config/config.service";
@Injectable()
export class AnalogService{

  constructor(private configService: ConfigService){}
  /**
   * 得到添加选择项
   * @returns {any}
   */
  getSelect(){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+`/analog/select`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return getAnalogSelect();
    }
  }

  /**
   * 添加模拟数据
   * @param account
   * @param data
   * @returns {any|undefined}
   */
  addAnalog(account,data){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.post(this.configService.getUrl(config)+`/analog/${account}`,data)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return analogService.addAnalog(account,data);
    }
  }

  /**
   * 根据接口id获取模拟数据
   * @param account
   * @param id
   */
  getAnalogByParent(account,id){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.get(this.configService.getUrl(config)+`/analog/${account}?parent=${id}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return analogService.getAnalogByParent(account,id);
    }
  }

  /**
   * 根据模拟数据id删除模拟数据
   */
  deleteAnalogById(account,id){
    let config = this.configService.getStateConfig();
    if(config['openRemote']){
      return new Promise((resolve, reject) => {
        axios.delete(this.configService.getUrl(config)+`/analog/${account}/${id}`)
          .then((data) => {
            resolve(data);
          })
          .catch((err)=>{
            reject(err);
          })
      });
    }else{
      return analogService.deleteAnalogById(account,id);
    }
  }
}

export const ANALOG_PROVIDERS: Array<any> = [
  { provide: AnalogService, useClass: AnalogService }
];
