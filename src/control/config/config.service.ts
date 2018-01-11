/**
 * Created by admin on 2018/1/10.
 */
import {Injectable, Inject} from "@angular/core";
import {getConfigBack, initSystem} from '../../../service/config/config';
import {Store} from "redux";
import {AppStore} from "../app.store";
import {AppState} from "../app.reducer";

import * as ConfigActions from './config.action';

@Injectable()
export class ConfigService{
  constructor(@Inject(AppStore) private store: Store<AppState>){}

  getConfig = ()=>{
    getConfigBack()
      .then((data)=>{
        this.store.dispatch(ConfigActions.getConfig(data));
        if(!data['activeState']){
          initSystem(data)
            .then((newdata)=>{
              this.store.dispatch(ConfigActions.getConfig(newdata));
            })
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  }

}

export const CONFIG_PROVIDERS: Array<any> = [
  { provide: ConfigService, useClass: ConfigService }
];
