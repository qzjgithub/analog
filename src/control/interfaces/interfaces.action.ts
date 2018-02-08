/**
 * Created by admin on 2018/1/25.
 */
import {Action, ActionCreator} from "redux";
export const GET_CUR_INTERFACES = '[cur_interfaces] GET';
export interface GetCurInterfacesAction extends Action {
  interfaces : {}
}
export const getCurInterfaces: ActionCreator<GetCurInterfacesAction> =
  (interfaces) => ({
    type: GET_CUR_INTERFACES,
    interfaces: interfaces
  });
