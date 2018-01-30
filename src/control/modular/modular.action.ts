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
