/**
 * Created by admin on 2018/1/23.
 */
const sqlite3 = require('sqlite3').verbose();
const dbutil = require('./dbutil');

/**
 * 添加一个项目
 * @param data
 */
const addProject = (data) => {
  let sql = `
  INSERT INTO project VALUES(
    NULL,
    $account , 
    $name , 
    $port ,
    $url , 
    $authority , 
    $comment , 
    $creator, 
    $valid, 
    $createdTime 
  );
  `;
  data.valid = true;
  data.createdTime = new Date();
  return dbutil.excuteParam(sql, data, 'run');
}

/**
 * 得到做验证项目的数据
 * @param data
 */
const getValidProject = (data) => {
  let sql = `
  SELECT * FROM project WHERE account=$account;
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

const addProjectUserRelated = (data)=>{
  let sql = `
  INSERT INTO project_user VALUES(
    $userAccount , 
    $projectAccount , 
    $relation 
  );
  `;
  return dbutil.excuteParam(sql, data, 'run');
}

module.exports = {
  addProject, getValidProject, addProjectUserRelated
}
