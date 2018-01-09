import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-manager/login/login.component';
import { LoginManagerComponent } from './login-manager/login-manager.component';
import { SetConfigComponent } from './set-config/set-config.component';
import { RemoteServerComponent } from './set-config/remote-server/remote-server.component';

import {USER_PROVIDERS} from "../control/user/user.service";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginManagerComponent,
    SetConfigComponent,
    RemoteServerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    USER_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
