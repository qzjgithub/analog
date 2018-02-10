/**
 * Created by qiuzhujun on 2018/1/28.
 */

/**
 * 根据名字得到模块
 * @param data
 */
const getModularByName = (account,data)=>{
  let sql = `
  SELECT * FROM modular
  WHERE name=$name
  ;`;
  return dbutil.excuteProjectParam(sql,account,data,'all');
}

/**
 * 添加一个模块
 * @param account
 * @param data
 */
const addModular = (account,data)=>{
  let sql = `
  INSERT INTO modular VALUES(
    NULL,
    $name ,
    $url ,
    $parent ,
    $comment ,
    $creator ,
    $createdTime
  );
  `;
  data['createdTime'] = new Date();
  return dbutil.excuteProjectParam(sql,account,data,'run');
}

/**
 * 得到项目下模块
 * @param account
 */
const getModularInProject = (account,data)=>{
  let sql = `
  SELECT
  m.*,
  (SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='write' AND ur.userAccount='`+data['login']+`') AS writable ,
  (SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='concern' AND ur.userAccount='`+data['login']+`') AS concern
  FROM modular m
  WHERE parent IS NULL OR parent='';
  `;
  return dbutil.excuteProjectParam(sql,account,{},'all');
}

/**
 * 根据父模块ID得到当前模块
 * @param account
 * @param data
 * @returns {Promise}
 */
const getModularByParent = (account,data)=>{
  let sql = `
  SELECT
  m.*,
  (SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='write' AND ur.userAccount='`+data['login']+`') AS writable ,
  (SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='concern' AND ur.userAccount='`+data['login']+`') AS concern
  FROM modular m
  WHERE parent=$parent;
  `;
  return dbutil.excuteProjectParam(sql,account,{ parent: data['parent'] },'all');
}
/**
 * 根据ID获取当前模块
 * @param account
 * @param data
 * @returns {Promise}
 */
const getModularById = (account,data)=>{
  let sql = `
SELECT
m.*
`;
  if(data['login']){
    sql += `,
(SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='write' AND ur.userAccount='`+data['login']+`') AS writable ,
(SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='concern' AND ur.userAccount='`+data['login']+`') AS concern `
  }
  sql += `FROM modular m
WHERE id=$id;`
  return dbutil.excuteProjectParam(sql,account,{ id: data['id'] },'all');
}
/**
 * 删除模块
 * @param account
 * @param data
 */
const deleteModular = (account,data)=>{
  let sql = `
  DELETE FROM modular
  WHERE id=$id
  ;
  `;
  return dbutil.excuteProjectParam(sql,account,{ id: data['id'] },'run');
}

/**
 * 根据modular的id删除用户关系
 */
const deleteModularUserByModularId = (account,data)=>{
  let sql = `
  DELETE FROM user_relation
  WHERE relatedId=$relatedId AND type='modular'
  ;
  `;
  return dbutil.excuteProjectParam(sql,account,{ relatedId: data['id'] },'run');
}
module.exports = {
  getModularByName,addModular,
  getModularInProject,getModularByParent,
  getModularById,
  deleteModular,
  deleteModularUserByModularId
}
