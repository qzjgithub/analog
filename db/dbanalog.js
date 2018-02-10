/**
 * Created by admin on 2018/2/9.
 */
/**
 * 根据接口的id数组删除模拟数据
 * @param account
 * @param data
 */
const deleteAnalogInInterfacesIds = (account,data)=>{
  let sql = `
  DELETE FROM analog
  WHERE parent IN (`+data.join(',')+`);
  ;`;
  return dbutil.excuteProjectParam(sql,account,{},'run');
}
module.exports = {
  deleteAnalogInInterfacesIds
}
