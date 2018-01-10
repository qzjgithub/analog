/**
 * Created by admin on 2018/1/9.
 */
const fs = require('fs');
const path = require('path');

initSystem = ()=>{}

/**
 * 读取配置文件内容
 */
const getConfigBack = (configPath)=>{
  return new Promise((resolve, reject)=>{
    path.join(__dirname , configPath)
    fs.readFile(configPath, (err, data)=>{
      if(err){
        reject(err);
      }else{
        data = JSON.parse(data);
        resolve(data);
        if(!data.activeState){
          initSystem();
        }
      }
    })
  });
}

module.exports = {
  getConfigBack
}
