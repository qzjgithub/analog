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

@Component({
  selector: 'app-analog-manage',
  templateUrl: './analog-manage.component.html',
  styleUrls: ['./analog-manage.component.css']
})
export class AnalogManageComponent implements OnInit {

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private configService: ConfigService,
    private _message: NzMessageService,
    private projectService: ProjectService,
    private modularService: ModularService,
    private interfacesService: InterfacesService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setBreadcrumb();
  }

  ngOnInit() {
  }

  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情','模拟数据'],1));
  }

  addAnalog(e){
    this.router.navigate([{outlets: {'modular': 'addAnalog'}}],{relativeTo: this.route.parent});
  }

  backModular(e){
    this.router.navigate([{outlets: {'modular': 'modular'}}],{relativeTo: this.route.parent});
  }
}
