/**
 * Created by admin on 2018/1/17.
 */
/**
 * 得到user用到的相关选项值
 */
const getUserSelect = ()=>{
  return new Promise((resolve , reject) => {
    dbutil.getSelectByName('position',{})
      .then((data) => dbutil.getSelectByName('phonePrefix',data))
      .then((data) =>{
        resolve(data);
      })
      .catch((err)=>{
        reject(err);
      })
  });
}

/**
 * 得到项目需要选项
 */
const getProjectSelect = ()=>{
  return new Promise((resolve , reject) => {
    dbutil.getSelectByName('authority',{})
      .then((data) =>{
        resolve(data);
      })
      .catch((err)=>{
        reject(err);
      })
  });
}

/**
 * 得到接口需要的选项
 */
const getInterfacesSelect = ()=>{
  return dbutil.getSelectByName('method',{})
}

/**
 * 得到模拟数据需要的选项
 */
const getAnalogSelect = ()=>{
  return dbutil.getSelectByName('saveType',{})
    .then((data)=>dbutil.getSelectByName('dataType',data));
}

module.exports = {
  getUserSelect,getProjectSelect,getInterfacesSelect,
  getAnalogSelect
}
