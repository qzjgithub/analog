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

module.exports = {
  getInterfacesByParent,
  getInterfacesInProject,
  getInterfacesAll
}
