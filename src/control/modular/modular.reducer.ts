/**
 * Created by qiuzhujun on 2018/1/30.
 */
import {Action} from "redux";
import * as ModularActions from './modular.action';

export interface ModularState {
  modular: {},
  modulars: Array<any>
}

const initialState: ModularState = {
  modular: {},
  modulars: []
}

export const ModularReducer =
  function(state: ModularState = initialState, action: Action): ModularState {
    switch (action.type) {
      case ModularActions.GET_CUR_MODULAR: {
        const modular = (<ModularActions.GetCurModularAction>action).modular;
        let modulars = state['modulars'];
        modulars.push(modular)
        state = {
          modular : modular,
          modulars: modulars
        }
        return state;
      }
      case ModularActions.CLEAR_MODULAR:{
        return {
          modular : {},
          modulars : []
        }
      }
      case ModularActions.GET_PARENT_MODULAR:{
        const modular = (<ModularActions.GetCurModularAction>action).modular;
        let modulars = state['modulars'];
        if(!modulars.length){
          state['modular'] = modular;
        }
        if(modular['writable']==='writer'){
          modulars.forEach((item)=>{
            item['writable'] = 'writer';
          })
        }
        modulars.unshift(modular);
        state['modulars'] = modulars;
        return state;
      }
      case ModularActions.BACK_LAST_MODULAR:{
        let modulars = state['modulars'];
        modulars.pop();

        state['modulars'] = modulars;
        if(modulars.length){
          state['modular'] = modulars[modulars.length-1];
          sessionStorage.setItem('modularId',state['modular']['id']);
        }else{
          state['modular'] = {};
          sessionStorage.removeItem('modularId');
        }
        return state;
      }
      default:
        return state;
    }
  };
