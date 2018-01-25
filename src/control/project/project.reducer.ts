/**
 * Created by admin on 2018/1/25.
 */
import {Action} from "redux";
import * as ProjectActions from './project.action';

export interface ProjectState {
  project: {}
}

const initialState: ProjectState = {
  project: {}
}

export const ProjectReducer =
  function(state: ProjectState = initialState, action: Action): ProjectState {
    switch (action.type) {
      case ProjectActions.GET_CUR_PROJECT: {
        const project = (<ProjectActions.GetCurProjectAction>action).project;
        state = {
          project : project,
        }
        return state;
      }
      default:
        return state;
    }
  };
