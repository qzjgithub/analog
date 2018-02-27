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
    if(data['active']){
      return new Promise((resolve,reject)=>{
      dbanalog.setInactiveByParent(account,{ parent: data['parent']})
        .then(()=>dbanalog.addAnalog(account,d))
        .then(()=>{
          resolve();
        })
        .catch((err)=>{
          reject(err);
        })
      })
    }else{
      return dbanalog.addAnalog(account,d);
    }
}

/**
 * 根据接口id获取模拟数据
 * @param account
 * @param parent
 */
const getAnalogByParent = (account,id)=>{
  return dbanalog.getAnalogByParent(account,{parent:id});
}

/**
 * 根据模拟数据id删除模拟数据
 * @param account
 * @param id
 * @returns {any|Promise}
 */
const deleteAnalogById = (account,id)=>{
  return dbanalog.deleteAnalogById(account,{id:id});
}
module.exports = {
  addAnalog,getAnalogByParent,deleteAnalogById
}
