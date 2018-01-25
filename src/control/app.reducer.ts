/**
 * Created by admin on 2017/6/15.
 */
/* tslint:disable:typedef */

import {
  Reducer,
  combineReducers
} from 'redux';
import {ConfigState, ConfigReducer} from "./config/config.reducer";
import {ProjectState, ProjectReducer} from "./project/project.reducer";

export interface AppState {
  config: ConfigState;
  project: ProjectState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  config: ConfigReducer,
  project: ProjectReducer
});

export default rootReducer;
