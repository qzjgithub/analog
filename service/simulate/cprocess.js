/**
 * Created by admin on 2017/11/6.
 */
const cp = require('child_process');
const path = require('path');

/*const n = cp.fork(`${__dirname}/httpservice.js`);
n.send({port:8090});
const n2 = cp.fork(`${__dirname}/httpservice.js`);
n2.send({port:8091});*/

/**
 * 启动模拟服务
 * @param id
 */
const startAnalogService = (account)=>{
  return new Promise((resolve,reject)=>{
    dbproject.getProjectByAccount({"account": account})
      .then((data)=>{
        if(data.length){
          data = data[0];
        }else{
          reject({ message: '无此项目'});
          return;
        }
        if(analogService[data['account']]){
          reject({message:data['name']+'已启动，请先关闭后再启动'});
        }else{
          for(let as in analogService){
            if(analogService[as] && data['port']===analogService[as]['project']['port']){
              reject({ message: '此端口已被使用'});
              return;
            }
          }
          const service = cp.fork(path.join(rootPath,'service/simulate/analogService.js'));
          service.on('message',(m)=>{
            console.log(m);
            switch(m.type){
              case 'fullPath':
                dbinterfaces.getInterfacesByFullPathAndMethod(m.account,{ fullPath: m.url,method: m.method})
                  .then((data)=>{
                    service.send({
                      type: 'fullPath',
                      data: data
                    });
                  })
                  .catch((err)=>{
                    service.send({
                      type: 'fullPath',
                      err: err
                    });
                  })
                break;
              case 'reg':
                dbinterfaces.getInterfacesByRegAndMethod(m.account,{ method: m.method })
                  .then((data)=>{
                    service.send({
                      type: 'reg',
                      data: data
                    });
                  })
                  .catch((err)=>{
                    service.send({
                      type: 'reg',
                      err: err
                    });
                  })
                break;
              case 'analog':
                dbanalog.getActiveAnalogByParent(m.account,{parent: m.parent})
                  .then((data)=>{
                    service.send({
                      type: 'analog',
                      data: data
                    });
                  })
                  .catch((err)=>{
                    service.send({
                      type: 'analog',
                      err: err
                    });
                  })
                break;
              default:
                console.log(m);
            }
          });
          service.send({
            type: 'start',
            port: data['port'],
            account: data['account']
          });
          analogService[data['account']] = {
            project: data,
            service: service
          };
          resolve();
        }
      })
      .catch((err)=>{
        reject(err);
      });
  });
}

/**
 * 关闭模拟服务
 * @param account
 */
const stopAnalogService = (account) => {
  return new Promise((resolve,reject) => {
    if(!analogService[account]){
      reject({ message : '此项目未启动'});
    }else{
      let service = analogService[account]['service'];
      service.kill();
      analogService[account] = null;
      resolve();
    }
  });
}

/**
 * 启动本地服务
 */
const startLocalService = () => {
  localService = cp.spawn('node', [path.join(rootPath,'service/simulate/localService.js')], {
    detached: false
  });
  return new Promise((resolve,reject)=>{
    localService.stdout.on('data',(data)=>{
      console.log(data);
      let result = '';
      try{
        result = JSON.parse(data);
      }catch(err){
        result = data.toString();
      }
      console.log(result);
      if(result['result']=='success'){
        resolve();
      }else if(result['result']=='fail'){
        reject(result);
      }
    });
  });
}

/**
 * 关闭本地服务
 */
const stopLocalService = () => {
  return new Promise((resolve,reject)=>{
    if(localService){
      localService.kill();
      localService = null;
      resolve();
    }else{
      reject({message: '无本地服务启动信息'});
    }
  });
}
module.exports = {
  startAnalogService,stopAnalogService,startLocalService,stopLocalService
}
