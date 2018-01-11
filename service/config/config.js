/**
 * Created by admin on 2018/1/9.
 */
const fs = require('fs');
const dbutil = require('../../db/dbutil');
const configPath = 'config/config.json';

/**
 * 初始化系统
 */
const initSystem = (data) => {
  return new Promise((resolve, reject)=>{
    data.activeState = true;
    setConfig(configPath,data)
      .then(()=>dbutil.initSystem())
      .then(()=>{
        resolve(data);
      })
      .catch((err)=>{
        reject(err);
      })
  })
}

/**
 * 读取配置文件内容
 */
const getConfigBack = ()=>{
  return new Promise((resolve, reject)=>{
    fs.readFile(configPath, (err, data)=>{
      if(err){
        reject(err);
      }else{
        data = JSON.parse(data);
        resolve(data);
      }
    })
  });
}

/**
 * 设置配置文件
 * @param configPath
 * @param data
 */
const setConfig = (configPath, data) => {
  return new Promise((resolve,reject) => {
    fs.writeFile(configPath,JSON.stringify(data),(err) =>{
      if(err){
        reject(err);
      }else {
        resolve();
      }
    });
  });
}

module.exports = {
  getConfigBack, initSystem
}
