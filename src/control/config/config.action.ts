/**
 * Created by admin on 2018/1/10.
 */
import {Action, ActionCreator} from "redux";
export const GET_CONFIG = '[init] GET';
export interface GetConfigAction extends Action {
  config : {}
}
export const getConfig: ActionCreator<GetConfigAction> =
  (config) => ({
    type: GET_CONFIG,
    config: config
  });

export const GET_LOGIN = '[login] GET';
export interface GetLoginAction extends Action {
  login : {}
}
export const getLogin: ActionCreator<GetLoginAction> =
  (login) => ({
    type: GET_LOGIN,
    login: login
  });

export const SET_BREADCRUMBS = '[breadcrumbs] SET';
export interface SetBreadcrumbsAction extends Action {
  item : any,
  index: number
}
export const setBreadcrumbsAction: ActionCreator<SetBreadcrumbsAction> =
  (item, index) => ({
    type: SET_BREADCRUMBS,
    item: item,
    index: index
  });
