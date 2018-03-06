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
  data.createdTime = data.createdTime || new Date();
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
 * 修改项目用户关系
 * @param data
 */
const modifyProjectUserRelated = (data)=>{
  let sql = `
  UPDATE project_user SET
    relation=$relation
   WHERE userAccount=$userAccount
   AND projectAccount=$projectAccount
  ;
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
  (SELECT ur.name FROM user ur WHERE ur.account=p.creator) AS creatorName,
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
 * 根据id得到项目信息
 * @param data
 */
const getProjectById = (data) => {
  let sql = `
  SELECT
  p.* ,
  (SELECT ur.name FROM user ur WHERE ur.account=p.creator) AS creatorName,
  u.name AS leader,
  u.account AS leaderAccount,
  u.id AS userId
  FROM project p,project_user pu,user u
  WHERE p.id=$id
  AND p.account=pu.projectAccount
  AND pu.userAccount=u.account
  AND pu.relation='leader'
  ;
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

/**
 * 得到当前用户负责的项目
 * @param data
 */
const getLeaderProject = (data)=>{
  let sql = `
  SELECT
  p.* ,
  (SELECT ur.name FROM user ur WHERE ur.account=p.creator) AS creatorName,
  u.name AS leader,
  u.account AS leaderAccount,
  u.id AS userId
  FROM project p,project_user pu,user u
  WHERE p.account=pu.projectAccount
  AND pu.userAccount=u.account
  AND pu.relation='leader'
  AND pu.userAccount='`+data['userAccount']+`'
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
  (SELECT ur.name FROM user ur WHERE ur.account=p.creator) AS creatorName,
  u.name AS leader,
  u.account AS leaderAccount,
  u.id AS userId
  FROM project p,project_user pu,user u
  WHERE p.account in (SELECT prur.projectAccount FROM project_user prur WHERE prur.userAccount='`+data['userAccount']+`')
  AND p.account=pu.projectAccount
  AND pu.userAccount=u.account
  AND pu.relation='leader'
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'all');
}

/**
 * 修改项目
 * @param data
 */
const modifyProject = (data) => {
  let sql = `
  UPDATE project SET
    name=$name ,
    port=$port ,
    url=$url ,
    authority=$authority ,
    comment=$comment
   WHERE account=$account
  ;
  `;
  return dbutil.excuteParam(sql, data, 'run');
}

/**
 * 得到登录者和此项目的所有关系
 */
const getLoginRelation = (account, data)=>{
  let sql = `
  SELECT * FROM user_relation ur
  WHERE ur.type='project' AND
  ur.userAccount='`+data['userAccount']+`'
  ;`;
  return dbutil.excuteProjectParam(sql,account,{},'all');
}

/**
 * 删除项目
 * @param account
 */
const deleteProject = (account) => {
  let sql = `
  DELETE FROM
  project
  WHERE account='`+account+`'
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'run');
}

/**
 * 删除用户与项目的关联关系
 * @param account
 */
const deleteProjectUser = (account) => {
  let sql = `
  DELETE FROM
  project_user
  WHERE projectAccount='`+account+`'
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'run');
}

/**
 * 删除项目下具体用户关系
 * @param account
 */
const deleteUserRelation = (account) => {
  let sql = `
  DELETE FROM
  user_relation
  ;
  `;
  return dbutil.excuteProjectParam(sql, account, {}, 'run');
}

/**
 * 根据项目账号获取项目
 * @param data
 * @returns {Promise}
 */
const getProjectByAccount = (data) => {
  let sql = `
  SELECT * FROM
  project
  WHERE account=$account
  ;
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

module.exports = {
  addProject, getValidProject, addProjectUserRelated,
  getPublicProject,getLoginProject,
  getLeaderProject,getRelatedProject,
  modifyProject,getLoginRelation,
  deleteProject,deleteProjectUser,deleteUserRelation,
  getProjectById,getProjectByAccount,
  modifyProjectUserRelated
}
