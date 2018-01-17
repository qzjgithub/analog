/**
 * Created by admin on 2018/1/12.
 */
/**
 * 验证登录是否成功
 */
const validLoginUser = (data) => {
  return new Promise((resolve, reject)=>{
    dbuser.getLoginUser(data)
      .then((data) => {
        if(data.length){
          resolve(data[0]);
        }else{
          reject();
        }
      })
      .catch((err) => {
        reject(err);
      })
  })
}

/**
 * 验证用户是否存在
 * @param data
 */
const validExistUser = (data) => {
  return new Promise((resolve, reject)=>{
    dbuser.getValidUser({account: data.account})
      .then((data)=>{
        if(data.length){
          reject({text:'已存在相同账号的用户'})
        }else{
          resolve();
        }
      })
      .catch((err)=>{
        reject(err);
      })
  })
}

/**
 * 添加用户
 * @param data
 */
const addUser = (data) => {
  return new Promise((resolve, reject)=>{
    data['role'] = 'user';
    validExistUser(data)
      .then(() => dbuser.addUser(data))
      .then(() => resolve())
      .catch((err) => reject(err));
  })
}

module.exports = {
  validLoginUser,addUser,validExistUser
}
