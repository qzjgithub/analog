/**
 * Created by qiuzhujun on 2018/1/30.
 */
import {Action} from "redux";
import * as ProjectActions from './modular.action';

export interface ModularState {
  modular: {}
}

const initialState: ModularState = {
  modular: {}
}

export const ModularReducer =
  function(state: ModularState = initialState, action: Action): ModularState {
    switch (action.type) {
      case ProjectActions.GET_CUR_MODULAR: {
        const modular = (<ProjectActions.GetCurModularAction>action).modular;
        state = {
          modular : modular,
        }
        return state;
      }
      default:
        return state;
    }
  };
