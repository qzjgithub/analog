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

module.exports = {
  getUserSelect,getProjectSelect
}
