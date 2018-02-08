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
import {ModularState, ModularReducer} from "./modular/modular.reducer";
import {InterfacesState, InterfacesReducer} from "./interfaces/interfaces.reducer";

export interface AppState {
  config: ConfigState;
  project: ProjectState;
  modular: ModularState;
  interfaces: InterfacesState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  config: ConfigReducer,
  project: ProjectReducer,
  modular: ModularReducer,
  interfaces: InterfacesReducer
});

export default rootReducer;
