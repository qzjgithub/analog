/**
 * Created by admin on 2018/1/25.
 */
import {Action} from "redux";
import * as InterfacesActions from './interfaces.action';

export interface InterfacesState {
  interfaces: {}
}

const initialState: InterfacesState = {
  interfaces: {}
}

export const InterfacesReducer =
  function(state: InterfacesState = initialState, action: Action): InterfacesState {
    switch (action.type) {
      case InterfacesActions.GET_CUR_INTERFACES: {
        const interfaces = (<InterfacesActions.GetCurInterfacesAction>action).interfaces;
        state = {
          interfaces : interfaces
        }
        return state;
      }
      default:
        return state;
    }
  };
