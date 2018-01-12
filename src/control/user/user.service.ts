/**
 * Created by admin on 2018/1/9.
 */
import {Injectable, Inject} from "@angular/core";
import { validLoginUser } from "../../../service/user/user";

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

}

export const USER_PROVIDERS: Array<any> = [
  { provide: UserService, useClass: UserService }
];
