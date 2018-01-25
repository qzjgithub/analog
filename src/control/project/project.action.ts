/**
 * Created by admin on 2018/1/25.
 */
import {Action, ActionCreator} from "redux";
export const GET_CUR_PROJECT = '[cur_project] GET';
export interface GetCurProjectAction extends Action {
  project : {}
}
export const getCurProject: ActionCreator<GetCurProjectAction> =
  (project) => ({
    type: GET_CUR_PROJECT,
    project: project
  });
