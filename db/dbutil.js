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
 * 执行带参数的数据库语句统一方法
 * @param sql
 * @param data
 */
const excuteParam = (sqlStr, data, method) => {
  let obj_data = {};
  for(let key in data){
    obj_data['$'+key] = data[key];
  }

  return new Promise((resolve , reject) => {
    sql(getRootDB())
      .then((db) => {
        let stm = db.prepare(sqlStr);
        stm[method](obj_data,function(err,data){
          db.close();
          if(err){
            console.log(err);
            reject(err);
          }else{
            console.log(sqlStr);
            console.log(data);
            resolve(data);
          }
        });
        stm.finalize();
      });
  });
}

/**
 * 执行项目下的数据库语句
 * @param sqlStr
 * @param account
 * @param data
 * @param method
 * @returns {Promise}
 */
const excuteProjectParam = (sqlStr,account, data, method) => {
  let obj_data = {};
  for(let key in data){
    obj_data['$'+key] = data[key];
  }

  return new Promise((resolve , reject) => {
    sql(getProjectDB(account))
      .then((db) => {
        let stm = db.prepare(sqlStr);
        stm[method](obj_data,function(err,data){
          db.close();
          if(err){
            console.log(err);
            reject(err);
          }else{
            console.log(sqlStr);
            console.log(data);
            resolve(data);
          }
        });
        stm.finalize();
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
const removeDir = (prefix,name,level,theres) => {
  let path = prefix.join('') + name;
  console.log(path);
  return new Promise((resolve,reject)=> {
    fs.existsSync(path) && fs.readdir(path, (err, files) => {
      if(files.length){
        theres = theres || resolve;
        let file = files.shift();
        let stat = fs.lstatSync(path + '/' + file);
        if(stat.isDirectory()){
          prefix.push(name+'/')
          removeDir(prefix,file,level+1,theres);
        }else{
          fs.unlink(path + '/' + file, (err) => {
            if (!err) {
              removeDir(prefix,name,level,theres);
            }else{
              reject(err);
            }
          })
        }
      }else{
        fs.rmdir(path, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
          console.log(level, prefix);
          if(level!=0){
            let n = prefix.pop().replace('/','');
            removeDir(prefix,n,level-1, theres);
          }else{
            theres && theres();
          }
        });
      }
    })
  })
}

/**
 * 删除某个项目的目录
 * @param account
 */
const removeProjectDir = (account) => {
  return removeDir([dbroot],account,0);
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
        initSelectSelect();
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
    $position ,
    $phone ,
    $email ,
    $comment ,
    $active ,
    $available ,
    $createdTime
  );
  `;
  let data = {
    account : "admin",
    password : passEncrypt("000000"),
    role : "admin",
    name : "管理员",
    position: "projectManager",
    phone : "+86-1234567890",
    email : "111@qq.com",
    comment : "aaaaa",
    active : false,
    available : true,
    createdTime : new Date()
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
   creator TEXT,
   valid BOOLEAN,
   createdTime DATE ,
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
  position TEXT,
  phone TEXT,
  email TEXT,
  comment TEXT,
  active BOOLEAN ,
  available BOOLEAN ,
  createdTime DATE
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
  projectAccount TEXT,
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
  let sqls = `
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
    let stm = db.prepare(sqls);
    stm.run(obj_data,function(err,data){
      db.close();
    });
    stm.finalize();
  });
}

/**
 * 初始化选项信息
 * @param db
 */
const initSelectSelect = () => {
  let datas = [
    { name: 'phonePrefix', value: '+86', text: '+86'},
    { name: 'phonePrefix', value: '+87', text: '+87'},
    { name: 'authority', value: 'public', text: '公开'},
    { name: 'authority', value: 'private', text: '私密'},
    { name: 'position', value: 'frontEndEngineer', text: '前端工程师'},
    { name: 'position', value: 'pythonEngineer', text: 'Python工程师'},
    { name: 'position', value: 'javaEngineer', text: 'Java工程师'},
    { name: 'position', value: 'projectManager', text: '项目经理'},
    { name: 'method', value: 'GET', text: 'GET'},
    { name: 'method', value: 'POST', text: 'POST'},
    { name: 'method', value: 'DELETE', text: 'DELETE'},
    { name: 'method', value: 'PUT', text: 'PUT'},
    { name: 'saveType', value: 'text', text: '文本'},
    { name: 'saveType', value: 'file', text: '文件'},
    { name: 'dataType', value: 'json', text: 'JSON'}
  ];
  for(let i = 0;i<datas.length;i++){
    addSelect(datas[i]);
  }
}

/**
 * 通过名称选择可选项
 * @param name
 */
const getSelectByName = (name,object)=>{
  let query = `
  SELECT * FROM select_list
  WHERE name=$name
  ;
  `;
  return new Promise((resolve , reject) => {
    sql(getRootDB())
      .then((db)=>{
        let stm = db.prepare(query);
        stm.all({ $name: name},function(err,data){
          if(err){
            reject(err);
          }else{
            object[name] = data;
            resolve(object);
          }
        });
        stm.finalize();
      })
      .catch((err)=>{
        reject(err);
      })
  })
}

const passEncrypt = (data) => {
  const ciper = crypto.createCipher('aes192', system_name);
  let encrypted = ciper.update(data, 'utf-8', 'hex');
  return encrypted + ciper.final('hex');
};

/**
 * 初始化项目
 * @param data
 */
const initProject = (data) => {
  return new Promise((resolve, reject)=>{
    createDir('data/'+data.account);
    sql(getProjectDB(data.account))
      .then((db) => createModular(db))
      .then((db) => createInterfaces(db))
      .then((db) => createAnalog(db))
      .then((db) => createUserRelation(db))
      .then((db) => {
        db.close();
        addLeaderRelation(data);
        resolve();
      })
      .catch((err)=>{
        reject(err);
      });
  })
}

/**
 * 创建模块表
 */
const createModular = (db) => {
  const sql = `
   CREATE TABLE IF NOT EXISTS modular(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   name TEXT,
   url TEXT,
   parent INTEGER,
   comment TEXT,
   creator TEXT,
   createdTime DATE ,
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
 * 创建接口表
 */
const createInterfaces = (db) => {
  const sql = `
   CREATE TABLE IF NOT EXISTS interfaces(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   url TEXT,
   fullPath TEXT,
   reg TEXT,
   method TEXT,
   parent INTEGER,
   comment TEXT,
   creator TEXT,
   createdTime DATE ,
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
 * 创建数据表
 */
const createAnalog = (db) => {
  const sql = `
   CREATE TABLE IF NOT EXISTS analog(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   saveType TEXT,
   data TEXT,
   dataType TEXT,
   parent INTEGER,
   comment TEXT,
   creator TEXT,
   createdTime DATE ,
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
 * 创建内容用户关联表
 * @param db
 */
const createUserRelation = (db) => {
  const sql = `
  CREATE TABLE IF NOT EXISTS user_relation(
  userAccount TEXT,
  type TEXT,
  relatedId INTEGER,
  relation TEXT,
  FOREIGN KEY(userAccount) REFERENCES user(account)
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
 * 查找
 * @param param
 * @returns {Promise}
 */
const selectProjectLeader = (param)=>{
  let sql = `
  SELECT * FROM user_relation 
  WHERE 
  userAccount='`+param['leader']+`' 
  AND type='project' 
  AND relation='leader'
  `;
  return excuteProjectParam(sql,param['account'],{},'all');
}

/**
 * 添加负责人的用户关系
 * @param db
 */
const addLeaderRelation = (param) => {
  let sqls = `
  INSERT INTO user_relation VALUES(
    $userAccount ,
    $type ,
    $relatedId ,
    $relation
  );
  `;
  let data = {
    userAccount: param['leader'],
    type: 'project',
    relatedId: '',
    relation: 'leader'
  }
  let obj_data = {};
  for(let key in data){
    obj_data['$'+key] = data[key];
  }

  sql(getProjectDB(param.account)).then((db)=>{
    let stm = db.prepare(sqls);
    stm.run(obj_data,function(err,data){
      db.close();
    });
    stm.finalize();
  });
}

module.exports = {
  getRootDB, getProjectDB,
  sql, excuteParam,excuteProjectParam,
  passEncrypt,
  createDir, removeProjectDir,
  initSystem,
  getSelectByName,
  initSelectSelect,
  initProject
}
