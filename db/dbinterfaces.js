/**
 * Created by qiuzhujun on 2018/2/1.
 */
/**
 * 根据父模块id查找接口
 * @param account
 * @param data
 * @returns {Promise}
 */
const getInterfacesByParent = (account,data)=>{
  let sql = `
  SELECT * FROM interfaces
  WHERE parent=$parent
  ;
  `;
  return dbutil.excuteProjectParam(sql,account,data,'all');
}

/**
 * 获取在项目下的接口
 */
const getInterfacesInProject = (account)=>{
  let sql = `
  SELECT * FROM interfaces
  WHERE parent='' OR parent IS NULL
  ;
  `;
  return dbutil.excuteProjectParam(sql,account,{},'all');
}

/**
 * 得到某项目下的所有接口
 * @param account
 * @returns {Promise}
 */
const getInterfacesAll = (account)=>{
  let sql = `
  SELECT * FROM interfaces
  ;
  `;
  return dbutil.excuteProjectParam(sql,account,{},'all');
}

/**
 * 根据路径和方法类型获取接口
 * @param account
 * @param data
 */
const getInterfacesByUrlAndMethod = (account,data)=>{
  let sql = `
  SELECT * FROM interfaces 
  WHERE url=$url AND method=$method 
  `;
  let param = { url : data['url'], method : data['method']}
  if(data['parent']){
    sql += `AND parent=$parent;`
    param['parent'] = data['parent'];
  }else{
    sql += `AND (parent IS NULL OR parent='');`
  }

  return dbutil.excuteProjectParam(sql,account,param,'all');
}

/**
 * 根据Id获取接口
 * @param account
 * @param data
 */
const getInterfacesById = (account,data)=>{
  let sql = `
SELECT
int.* 
`;
  if(data['login']){
    sql += `,
(SELECT ur.relation FROM user_relation ur WHERE int.id=ur.relatedId AND ur.type='modular' AND ur.relation='write' AND ur.userAccount='`+data['login']+`') AS writable ,
(SELECT ur.relation FROM user_relation ur WHERE int.id=ur.relatedId AND ur.type='modular' AND ur.relation='concern' AND ur.userAccount='`+data['login']+`') AS concern `
  }
  sql += `FROM interfaces int
WHERE id=$id;`
  return dbutil.excuteProjectParam(sql,account,{ id: data['id']},'all');
}

/**
 * 添加接口
 * @param account
 * @param data
 */
const addInterfaces = (account,data)=>{
  let sql = `
  INSERT INTO interfaces VALUES(
    NULL,
    $url ,
    $fullPath ,
    $reg ,
    $method ,
    $parent ,
    $comment ,
    $creator ,
    $createdTime
  );
  `;
  data['createdTime'] = new Date();
  return dbutil.excuteProjectParam(sql,account,data,'run');
}

module.exports = {
  getInterfacesByParent,
  getInterfacesInProject,
  getInterfacesAll,
  getInterfacesByUrlAndMethod,
  getInterfacesById,
  addInterfaces
}
