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

/**
 * 添加用户和项目的关联数据
 * @param data
 */
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

/**
 * 得到当前登录用户所有相关的项目account
 * @param data
 */
const getLoginProject = (data)=>{
  let sql = `
  SELECT * FROM 
  project_user 
  WHERE userAccount=$userAccount
  ;
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

/**
 * 得到所有公开的项目
 */
const getPublicProject = ()=>{
  let sql = `
  SELECT 
  p.* , 
  u.name AS leader, 
  u.account AS leaderAccount,
  u.id AS userId 
  FROM project p,project_user pu,user u 
  WHERE p.authority='public' 
  AND p.account=pu.projectAccount 
  AND pu.userAccount=u.account 
  AND pu.relation='leader'
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'all');
}

/**
 * 得到当前用户负责的项目
 * @param data
 */
const getLeaderProject = (data)=>{
  let sql = `
  SELECT 
  p.* , 
  u.name AS leader, 
  u.account AS leaderAccount,
  u.id AS userId 
  FROM project p,project_user pu,user u 
  WHERE p.account=pu.projectAccount 
  AND pu.userAccount=`+data['userAccount']+` 
  AND pu.relation='leader' 
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'all');
}
/**
 * 得到相关的项目
 */
const getRelatedProject = (data) =>  {
  let sql = `
  SELECT 
  p.* , 
  u.name AS leader, 
  u.account AS leaderAccount,
  u.id AS userId 
  FROM project p,project_user pu,user u 
  WHERE p.account in (SELECT prur.projectAccount FROM project_user prur WHERE prur.userAccount=`+data['userAccount']+`) 
  AND p.authority='public' 
  AND p.account=pu.projectAccount 
  AND pu.userAccount=u.account 
  AND pu.relation='leader'
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'all');
}

module.exports = {
  addProject, getValidProject, addProjectUserRelated,
  getPublicProject,getLoginProject,
  getLeaderProject,getRelatedProject
}
