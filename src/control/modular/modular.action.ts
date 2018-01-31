/**
 * Created by qiuzhujun on 2018/1/30.
 */
import {Action, ActionCreator} from "redux";
export const GET_CUR_MODULAR = '[cur_modular] GET';
export interface GetCurModularAction extends Action {
  modular : {}
}
export const getCurModular: ActionCreator<GetCurModularAction> =
  (modular) => ({
    type: GET_CUR_MODULAR,
    modular: modular
  });


export const CLEAR_MODULAR = '[clear_modular] DELETE';
export interface ClearModularAction extends Action {
}
export const clearModular: ActionCreator<ClearModularAction> =
  () => ({
    type: CLEAR_MODULAR
  });

export const GET_PARENT_MODULAR = '[parent_modular] GET';
export interface getParentModularAction extends Action {
  modular: {}
}
export const getParentModular: ActionCreator<getParentModularAction> =
  (modular) => ({
    type: GET_PARENT_MODULAR,
    modular: modular
  });
