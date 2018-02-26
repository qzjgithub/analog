/**
 * Created by admin on 2017/11/6.
 */
const cp = require('child_process');

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
          const service = cp.fork('service/simulate/httpservice.js');
          service.send({port:data['port'],account: data['account']});
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

module.exports = {
  startAnalogService,stopAnalogService
}
