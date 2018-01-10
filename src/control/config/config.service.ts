/**
 * Created by admin on 2018/1/10.
 */
import {Injectable, Inject} from "@angular/core";
import {getConfigBack} from '../../../service/config/config';

@Injectable()
export class ConfigService{
  constructor(){}

  getConfig = ()=>{
    let path = 'config/config.json';
    return getConfigBack(path);
  }

}

export const CONFIG_PROVIDERS: Array<any> = [
  { provide: ConfigService, useClass: ConfigService }
];
