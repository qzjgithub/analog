  /**
 * Created by qiuzhujun on 2018/1/28.
 */
const getModularWrite = (account)=>{
  let sql = `
  SELECT userAccount FROM user_relation ur
  WHERE
  (ur.type='project' AND ur.relation='participant')
  OR
  (ur.type!='project' AND ur.relation!='concern')
  ;`;
  return dbutil.excuteProjectParam(sql,account,{},'all');
}

/**
 * 得到可添加为模块编写者的人的名字
 * @param accounts
 */
const getModularWriteUser = (accounts)=>{
accounts.map((item)=>{
  return `'`+item+`'`;
})
let sql = `
SELECT * FROM user
WHERE account in(`+accounts.join(',')+`)
;
`;
return dbutil.excuteParam(sql, {}, 'run');
}

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
m.*,
(SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='write' AND ur.userAccount='`+data['login']+`') AS writable ,
(SELECT ur.relation FROM user_relation ur WHERE m.id=ur.relatedId AND ur.type='modular' AND ur.relation='concern' AND ur.userAccount='`+data['login']+`') AS concern
FROM modular m
WHERE id=$id;
`;
  return dbutil.excuteProjectParam(sql,account,{ id: data['id'] },'all');
}
module.exports = {
  getModularWrite,getModularWriteUser,
  getModularByName,addModular,
  getModularInProject,getModularByParent,
  getModularById
}
