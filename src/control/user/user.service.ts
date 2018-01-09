/**
 * Created by admin on 2018/1/9.
 */
import {Injectable, Inject} from "@angular/core";

@Injectable()
export class UserService{
  constructor(){}

  validLogin = (param)=>{
    let a = 1;
    return new Promise(resolve => {
      setTimeout(()=>{ resolve(a+1) },1000)
    });
  }
  /**
   * 得到所有的项目信息
   * @param reject
   */
  getAllProjects(reject?){
    window['projectdb'].getAllProjects().then((rows)=>{
      console.log(rows);
      reject && reject(rows);
    });
  }

  /**
   * 添加项目
   * @param data
   */
  add(data,reject?){
    window['projectdb'].add(data).then((row)=>{
      console.log(row);
      reject && reject(row);
    });
  }

}

export const USER_PROVIDERS: Array<any> = [
  { provide: UserService, useClass: UserService }
];
