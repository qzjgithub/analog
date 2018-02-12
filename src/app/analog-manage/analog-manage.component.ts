import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {Router, ActivatedRoute} from "@angular/router";
import {NzModalService, NzMessageService} from "ng-zorro-antd";
import {InterfacesService} from "../../control/interfaces/interfaces.service";
import {ModularService} from "../../control/modular/modular.service";
import {ProjectService} from "../../control/project/project.service";
import {ConfigService} from "../../control/config/config.service";
import {AnalogService} from "../../control/analog/analog.service";

@Component({
  selector: 'app-analog-manage',
  templateUrl: './analog-manage.component.html',
  styleUrls: ['./analog-manage.component.css']
})
export class AnalogManageComponent implements OnInit {

  project: any;

  interfaces: any;

  data: Array<any>;

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private configService: ConfigService,
    private _message: NzMessageService,
    private analogService: AnalogService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.project = {};
    this.interfaces = {};
    this.data = [];
    this.store.subscribe(()=>this.dealData());
    this.setBreadcrumb();
  }

  ngOnInit() {
  }

  dealData(){
    const state = this.store.getState();
    this.project = state['project']['project'];
    this.interfaces = state['interfaces']['interfaces'];
    this.getData();
  }

  getData(){
    if(this.project['id']&&this.interfaces['id']){
      this.analogService.getAnalogByParent(this.project['account'],this.interfaces['id'])
        .then((data)=>{
          this.data = data;
        })
        .catch((err)=>{
          console.log(err.message);
        })
    }
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情','模拟数据'],1));
  }


  getDate(data){
    let date = new Date(Number(data));
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()+' '
      +date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  }

  addAnalog(e){
    this.router.navigate([{outlets: {'modular': 'addAnalog'}}],{relativeTo: this.route.parent});
  }

  backModular(e){
    this.router.navigate([{outlets: {'modular': 'modular'}}],{relativeTo: this.route.parent});
  }

  modifyAnalog(e,data){}

  deleteAnalog(e,data){}
}
