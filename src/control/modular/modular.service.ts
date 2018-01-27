/**
 * Created by qiuzhujun on 2018/1/28.
 */
import {Injectable, Inject} from "@angular/core";
import * as modularService from "../../../service/modular/modular";
@Injectable()
export class ModularService{
  /**
   * 得到模块选择项
   * @param account
     */
  getSelect = (account) => {
    return modularService.getSelect(account);
  }

  /**
   * 添加模块
   * @param account
   * @param data
     */
  addModular = (account,data) => {
      return modularService.addModular(account,data);
  }
}

export const MODULAR_PROVIDERS: Array<any> = [
  { provide: ModularService, useClass: ModularService }
];
