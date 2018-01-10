/**
 * Created by admin on 2017/6/15.
 */
/* tslint:disable:typedef */

import {
  Reducer,
  combineReducers
} from 'redux';
import {ConfigState, ConfigReducer} from "./config/config.reducer";

export interface AppState {
  config: ConfigState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  config: ConfigReducer
});

export default rootReducer;
