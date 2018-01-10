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
