/**
 * Created by admin on 2018/2/11.
 */
import {Injectable} from "@angular/core";
import * as analogService from "../../../service/analog/analog";
import { getAnalogSelect } from "../../../service/selectList/selectList";
@Injectable()
export class AnalogService{
  getSelect(){
    return getAnalogSelect();
  }
}

export const ANALOG_PROVIDERS: Array<any> = [
  { provide: AnalogService, useClass: AnalogService }
];
