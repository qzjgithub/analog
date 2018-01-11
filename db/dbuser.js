/**
 * Created by admin on 2018/1/11.
 */
const sqlite3 = require('sqlite3').verbose();
const dbutil = require('./dbutil');

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
    $phone , 
    $email , 
    $comment , 
    $active 
  );
  `;
  let obj_data = {};
  for(let key in data){
    obj_data['$'+key] = data[key];
  }

  return new Promise((resolve , reject) => {
    dbutil.sql(dbutil.getRootDB())
      .then((db) => {
        let stm = db.prepare(sql);
        stm.run(obj_data,function(err,data){
          if(err){
            reject(err);
          }else{
            resolve(data);
          }
        });
        stm.finalize();
      });
  });
}

module.exports = {}
