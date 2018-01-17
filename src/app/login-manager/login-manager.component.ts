import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd";
import {ConfigService} from "../../control/config/config.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'login-manager',
  templateUrl: './login-manager.component.html',
  styleUrls: ['./login-manager.component.css']
})
export class LoginManagerComponent implements OnInit {

  /**
   * 当前连接模式，是本地还是服务端
   */
  pattern: String;

  changePattern(){
    this.configService.setOpenRemote(this.pattern==='local' ? true : false)
      .then((data)=>{
        this.pattern = this.pattern==='local' ? 'remote' : 'local';
        this._message.create('success',(this.pattern === 'local' ? '关闭' : '开启')+'远程服务成功');
      })
      .catch(()=>{
        this._message.create('success',(this.pattern === 'local' ? '开启' : '关闭')+'远程服务失败');
      })


  }

  constructor(private configService: ConfigService,
              private _message: NzMessageService,
              private route: ActivatedRoute,
              private router: Router) {
    this.pattern = 'local';
  }

  ngOnInit() {
    if(this.router.url==="/loginManage"){
      this.router.navigate([{outlets: {'userEnter': 'login'}}],{relativeTo: this.route});
    }
  }
}
