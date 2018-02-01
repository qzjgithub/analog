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
  return dbutil.excuteProjectParam(sql,account,{ parent: data['id'] },'all');
}

module.exports = {
  getInterfacesByParent
}
