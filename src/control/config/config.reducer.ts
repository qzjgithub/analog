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
  config : {},
  login : {},
  breadcrumbs : Array<any>
}

const initialState: ConfigState = {
  config: {},
  login: {},
  breadcrumbs: []
}

export const ConfigReducer =
  function(state: ConfigState = initialState, action: Action): ConfigState {
    switch (action.type) {
      case ConfigActions.GET_CONFIG: {
        const config = (<ConfigActions.GetConfigAction>action).config;
        state = {
          config : config,
          login : state.login,
          breadcrumbs: state.breadcrumbs
        }
        return state;
      }
      case ConfigActions.GET_LOGIN: {
        const login = (<ConfigActions.GetLoginAction>action).login;
        state = {
          config : state.config,
          login : login,
          breadcrumbs: state.breadcrumbs
        }
        return state;
      }
      case ConfigActions.SET_BREADCRUMBS: {
        const item = (<ConfigActions.SetBreadcrumbsAction>action).item;
        const index = (<ConfigActions.SetBreadcrumbsAction>action).index;
        let arr = [],breadcrumbs = state.breadcrumbs,i = 0;
        while(i<index){
          arr.push(breadcrumbs[i]);
          i++;
        }
        arr = [...arr, ...item];
        state = {
          config : state.config,
          login : state.login,
          breadcrumbs: arr
        }
        return state;
      }
      default:
        return state;
    }
  };

export const getConfigState = (state): ConfigState => state.config;
