import {Component, OnInit, Inject} from '@angular/core';
import * as ConfigActions from '../../control/config/config.action';
import {AppState} from "../../control/app.reducer";
import {Store} from "redux";
import {AppStore} from "../../control/app.store";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: any;

  constructor(
    @Inject(AppStore) private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.subscribe(()=> this.dealProject())
    this.setBreadcrumb();
  }


  dealProject(){
    const state = this.store.getState();
    this.project = state['project']['project'];
  }

  ngOnInit() {
  }
  setBreadcrumb(){
    this.store.dispatch(ConfigActions.setBreadcrumbsAction(['项目管理','项目详情'],1));
  }

}
