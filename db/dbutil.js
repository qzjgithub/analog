/**
 * Created by admin on 2018/1/10.
 */
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const fs = require('fs');
const dbroot = 'data/';
const system_name = 'ISS-QZJ';

/**
 * 获取某个数据库
 * @param path
 * @returns {exports.cached.Database}
 */
const getDB = (path) => {
  return new sqlite3.Database(path);
}

/**
 * 获取根数据库
 * @returns {exports.cached.Database}
 */
const getRootDB = () => {
  return getDB(dbroot + 'common.db');
}

/**
 * 获取某项目下的数据库
 * @param project
 * @returns {exports.cached.Database}
 */
const getProjectDB = (project) => {
  return getDB(dbroot + project + '/storage.db');
}

/**
 * 执行sql语句
 * @param db
 * @param fun
 */
const sql = (db) => {
  return new Promise((resolve , reject) => {
    db.serialize((err) => {
      if(!err){
        resolve(db)
      }else{
        reject(err);
      }
    });
  });
}

/**
 * 创建目录
 * @param name
 */
const createDir = (name) => {
  if(!fs.existsSync(name)){
    fs.mkdirSync(name);
  }
}

/**
 * 删除某个目录
 * @param name
 */
const removeDir = (name) => {
  let path = dbroot + name;
  fs.existsSync(path) && fs.readdir(path,(err,files)=>{
    let rmfile = function(i){
      if(i<files.length){
        fs.unlink(path+'/'+files[i],(err)=>{
          if(!err){
            rmfile(++i);
          }
        })
      }else{
        fs.rmdir(path);
      }
    }
    rmfile(0);
  })
}

/**
 * 初始化系统
 */
const initSystem = () => {
  return new Promise((resolve, reject)=>{
    createDir('data');
    sql(getRootDB())
      .then((db) => createUser(db))
      .then((db) => createProject(db))
      .then((db) => createProjectUser(db))
      .then((db) => createSelect(db))
      .then((db) => addAdminUser(db))
      .then((db) => {
        initPositionSelect();
        db.close();
        resolve();
      })
      .catch((err)=>{
        reject(err);
      });
  })
}

/**
 * 添加初始化管理员
 * @param db
 */
const addAdminUser = (db)=>{
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
  let data = {
    account : "admin",
    password : passEncrypt("000000"),
    role : "admin",
    name : "管理员",
    phone : "1234567890",
    email : "111@qq.com",
    comment : "aaaaa",
    active : true
  };
  let obj_data = {};
  for(let key in data){
    obj_data['$'+key] = data[key];
  }

  return new Promise((resolve , reject) => {
      let stm = db.prepare(sql);
      stm.run(obj_data,function(err,data){
        if(err){
          reject(err);
        }else{
          resolve(db);
        }
      });
      stm.finalize();
  });
}
/**
 * 创建项目表
 */
const createProject = (db) =>{
  const sql = `
   CREATE TABLE IF NOT EXISTS project(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   account TEXT NOT NULL UNIQUE,
   name TEXT, 
   port TEXT, 
   url TEXT, 
   authority TEXT, 
   comment TEXT, 
   createTime TEXT,
   creator TEXT, 
   valid BOOLEAN,
   FOREIGN KEY(creator) REFERENCES user(account)
   );
  `;
  return new Promise((resolve , reject) => {
    db.run(sql,(err)=>{
      if(!err){
        resolve(db)
      }else{
        reject(err);
      }
    });
  });
}

/**
 * 创建用户表
 */
const createUser = (db) => {
  const sql = `
  CREATE TABLE IF NOT EXISTS user(
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  account TEXT NOT NULL UNIQUE, 
  password TEXT, 
  role TEXT, 
  name TEXT, 
  phone TEXT, 
  email TEXT, 
  comment TEXT, 
  active BOOLEAN 
  );
  `;
  return new Promise((resolve , reject) => {
    db.run(sql,(err)=>{
      if(!err){
        resolve(db);
      }else{
        reject(err);
      }
    });
  });
}

/**
 * 创建项目用户关联表
 * @param db
 */
const createProjectUser = (db) => {
  const sql = `
  CREATE TABLE IF NOT EXISTS project_user(
  userAccount TEXT,
  ProjectAccount TEXT,
  relation TEXT,
  FOREIGN KEY(userAccount) REFERENCES user(account),
  FOREIGN KEY(ProjectAccount) REFERENCES project(account)
  );
  `;
  return new Promise((resolve , reject) => {
    db.run(sql,(err)=>{
      if(!err){
        resolve(db);
      }else{
        reject(err);
      }
    });
  });
}

/**
 * 创建选项表
 * @param db
 */
const createSelect = (db) => {
  const sql = `
  CREATE TABLE IF NOT EXISTS select_list(
  name TEXT NOT NULL,
  value TEXT NOT NULL, 
  text TEXT
  );
  `;
  return new Promise((resolve , reject) => {
    db.run(sql,(err)=>{
      if(!err){
        resolve(db);
      }else{
        reject(err);
      }
    });
  });
}

/**
 * 添加选项表
 * @param db
 */
const addSelect = (data) => {
  let sql = `
  INSERT INTO select_list VALUES(
    $name , 
    $value , 
    $text 
  );
  `;
  let obj_data = {};
  for(let key in data){
    obj_data['$'+key] = data[key];
  }

  sql(getRootDB()).then((db)=>{
    let stm = db.prepare(sql);
    stm.run(obj_data,function(err,data){
      db.close();
    });
    stm.finalize();
  });
}

/**
 * 初始化职位信息
 * @param db
 */
const initPositionSelect = () => {
  let datas = [
    { name: 'position', value: 'frontEndEngineer', text: '前端工程师'},
    { name: 'position', value: 'PythonEngineer', text: 'Python工程师'},
  ];
  for(let i = 0;i<datas.length;i++){
    addSelect(datas[i]);
  }
}

const passEncrypt = (data) => {
  const ciper = crypto.createCipher('aes192', system_name);
  let encrypted = ciper.update(data, 'utf-8', 'hex');
  return encrypted + ciper.final('hex');
};

module.exports = {
  getRootDB, getProjectDB,
  sql, passEncrypt,
  createDir, removeDir,
  initSystem
}
