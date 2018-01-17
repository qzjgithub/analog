/**
 * Created by admin on 2018/1/9.
 */
import {Injectable, Inject} from "@angular/core";
import { validLoginUser, addUser, validExistUser } from "../../../service/user/user";
import { getUserSelect } from "../../../service/selectList/selectList";

@Injectable()
export class UserService{
  constructor(){}

  /**
   * 验证登录是否成功
   * @param param
   * @returns {any}
   */
  validLogin = (param)=>{
    return validLoginUser(param);
  }

  /**
   * 得到用户相关选项
   * @returns {any}
   */
  getSelect = () =>{
    return getUserSelect();
  }

  /**
   * 添加用户
   * @returns {any}
   */
  add = (data) =>{
    return addUser(data);
  }

  /**
   * 验证该账号是否存在
   * @param data
   * @returns {any}
   */
  validExist = (data) => {
    return validExistUser(data);
  }

}

export const USER_PROVIDERS: Array<any> = [
  { provide: UserService, useClass: UserService }
];
