/**
 * Created by admin on 2018/1/11.
 */
const sqlite3 = require('sqlite3').verbose();
const dbutil = require('./dbutil');

/**
 * 执行带参数的数据库语句统一方法
 * @param sql
 * @param data
 */
const excuteParam = (sql, data, method) => {
  let obj_data = {};
  for(let key in data){
    obj_data['$'+key] = data[key];
  }

  return new Promise((resolve , reject) => {
    dbutil.sql(dbutil.getRootDB())
      .then((db) => {
        let stm = db.prepare(sql);
        stm[method](obj_data,function(err,data){
          if(err){
            console.log(err);
            reject(err);
          }else{
            console.log(data);
            resolve(data);
          }
        });
        stm.finalize();
      });
  });
}

/**
 * 验证是否登录成功
 * @param data
 */
const getLoginUser = (data) => {
  let sql = `
  SELECT * FROM user WHERE account=$account AND password=$password;
  `;
  data.password = dbutil.passEncrypt(data.password);
  console.log(data);
  return excuteParam(sql, data, 'all');
}
/**
 * 添加一个用户
 * @param data
 */
const addUser = (data) => {
  let sql = `
  INSERT INTO user VALUES(
    NULL,
    $account , 
    $password , 
    $role , 
    $name , 
    $position ,
    $phone , 
    $email , 
    $comment , 
    $active ,
    $createdTime 
  );
  `;
  data.createdTime = new Date();
  data.password = dbutil.passEncrypt(data.password);
  return excuteParam(sql, data, 'run');
}

/**
 * 得到做验证用户的数据
 * @param data
 */
const getValidUser = (data) => {
  let sql = `
  SELECT * FROM user WHERE account=$account;
  `;
  console.log(data);
  return excuteParam(sql, data, 'all');
}

/**
 * 修改密码
 * @param data
 */
const modifyPwd = (data) => {
  let sql = `
  UPDATE user 
  SET password=$password ,active=$active 
  WHERE id=$id
  ;
  `;
  data.password = dbutil.passEncrypt(data.password);
  return excuteParam(sql, data, 'run');
}

const getUserById = (data) => {
  let sql = `
  SELECT * FROM user 
  WHERE id=$id
  ;
  `;
  return excuteParam(sql, data, 'all');
}

module.exports = {
  getLoginUser, addUser, getValidUser, modifyPwd,getUserById
}
