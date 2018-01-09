/**
 * Created by admin on 2018/1/9.
 */
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname , '../../config/config.json');

/**
 * 读取配置文件内容
 */
const getConfig = ()=>{
  return new Promise((reslove, reject)=>{
    fs.readFile(configPath, (err, data)=>{
      if(err){
        reject(err);
      }else{
        reslove(JSON.parse(data));
      }
    })
  });
}

module.exports = {
  getConfig
}
