/**
 * Created by admin on 2018/2/11.
 */
/**
 * 添加模拟数据
 * @param account
 * @param data
 * @returns {any|undefined}
 */
const addAnalog = (account,data)=>{
  let d = {
    saveType: data['saveType'],
    data: data['data'],
    dataType: data['dataType'],
    parent: data['parent'],
    active: data['active'],
    comment: data['comment'],
    creator: data['creator']
  };
  return dbanalog.addAnalog(account,d);
}

/**
 * 根据接口id获取模拟数据
 * @param account
 * @param parent
 */
const getAnalogByParent = (account,id)=>{
  return dbanalog.getAnalogByParent(account,{parent:id});
}
module.exports = {
  addAnalog,getAnalogByParent
}
