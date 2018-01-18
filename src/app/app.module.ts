import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgZorroAntdModule} from "ng-zorro-antd";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {appStoreProviders} from "../control/app.store";
import {AppComponent} from "./app.component";
import {USER_PROVIDERS} from "../control/user/user.service";
import {CONFIG_PROVIDERS} from "../control/config/config.service";

import {LoginComponent} from "./login-manager/login/login.component";
import {LoginManagerComponent} from "./login-manager/login-manager.component";
import {SetConfigComponent} from "./set-config/set-config.component";
import {RemoteServerComponent} from "./set-config/remote-server/remote-server.component";
import {RegisterComponent} from "./login-manager/register/register.component";
import { HomeComponent } from './home/home.component';
import { CheckUserComponent } from './check-user/check-user.component';
import { PersonCenterComponent } from './person-center/person-center.component';

const routes: Routes = [
  { path: '', redirectTo: 'loginManage',pathMatch: 'full' },
  { path: 'loginManage',component: LoginManagerComponent ,children:[
    {path:'login',component: LoginComponent , outlet: 'userEnter' },
    {path:'register',component: RegisterComponent , outlet: 'userEnter' }
  ]},
  { path: 'checkUser',component: CheckUserComponent },
  { path: 'home',component: HomeComponent ,children:[
    {path:'',component: PersonCenterComponent , outlet: 'content' },
    {path:'person',component: PersonCenterComponent , outlet: 'content' },
  ]}
]


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginManagerComponent,
    SetConfigComponent,
    RemoteServerComponent,
    RegisterComponent,
    HomeComponent,
    CheckUserComponent,
    PersonCenterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    appStoreProviders,
    USER_PROVIDERS,
    CONFIG_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
