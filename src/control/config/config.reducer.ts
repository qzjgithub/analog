/**
 * Created by admin on 2018/1/10.
 */
import {Action} from "redux";
import * as ConfigActions from './config.action';
import {createSelector} from "reselect";
/**
 * 点击事件store数据模型
 */
export interface ConfigState {
  config : {}
}

const initialState: ConfigState = {
  config: {}
}

export const ConfigReducer =
  function(state: ConfigState = initialState, action: Action): ConfigState {
    switch (action.type) {
      case ConfigActions.GET_CONFIG: {
        const config = (<ConfigActions.GetConfigAction>action).config;
        state = {
          config : config
        }
        return state;
      }
      default:
        return state;
    }
  };

export const getConfigState = (state): ConfigState => state.config;
