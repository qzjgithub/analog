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
          delete data[0]['password'];
          resolve(data[0]);
        }else{
          reject({ message:'用户名或密码错误' });
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
          reject({ message:'已存在相同账号的用户' })
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

/**
 * 修改密码
 * @param data
 */
const modifyPwdUser = (data) => {
  return dbuser.modifyPwd(data);
}

/**
 * 根据id获取用户
 * @param data
 * @returns {any}
 */
const getUserById = (data) => {
  return new Promise((resolve, reject)=>{
    dbuser.getUserById(data)
      .then((data)=>{
        if(data.length){
          delete data[0].password;
          resolve(data[0]);
        }else{
          reject({ message: '用户不存在' })
        }
      })
      .catch((err)=>{
        reject(err);
      })
  })
}

/**
 * 修改用户
 * @param data
 */
const modifyUser = (data) => {
  return dbuser.modifyUser(data);
}

/**
 * 通过旧密码修改密码
 * @param data
 */
const modifyPwdWithOld = (data) => {
  return new Promise((resolve, reject) => {
    dbuser.validOldPwd({ id: data.id, password: data.oldPassword})
      .then((datas) => {
        if(datas.length){
          dbuser.modifyPwd({ id: data.id, password: data.password, active: true})
            .then(()=>{
              resolve();
            })
            .catch((err)=>{
              reject(err);
            })
        }else{
          reject({ message: '旧密码不正确'});
        }
      })
      .catch((err)=>{
        reject(err);
      })
  })
}

/**
 * 得到用户列表
 * @returns {any}
 */
const getUserList = () => {
  return dbuser.getUserList();
}

/**
 * 根据用户account得到用户的名字
 * @returns {any}
 */
const getUserByAccount = (data) => {
  return dbuser.getUserByAccount(data);
}

/**
 * 得到可添加的可编写用户
 * @param account
 */
const getWritableUser = (account) => {
  return new Promise((resolve,reject)=>{
    dbuser.getWritableAccount(account)
      .then((accounts)=>dbuser.getUserInAccount(accounts))
      .catch((err)=>{
        reject(err)
      })
  })
}

module.exports = {
  validLoginUser,
  addUser,
  validExistUser,
  modifyPwdUser,
  getUserById,
  modifyUser,
  modifyPwdWithOld,
  getUserList,
  getUserByAccount,
  getWritableUser
}
