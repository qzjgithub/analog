/**
 * Created by admin on 2018/1/11.
 */
const sqlite3 = require('sqlite3').verbose();
const dbutil = require('./dbutil');

/**
 * 验证是否登录成功
 * @param data
 */
const getLoginUser = (data) => {
  let sql = `
  SELECT * FROM user WHERE account=$account AND password=$password;
  `;
  data.password = dbutil.passEncrypt(data.password);
  console.log(data);
  return dbutil.excuteParam(sql, data, 'all');
}
/**
 * 添加一个用户
 * @param data
 */
const addUser = (data) => {
  let sql = `
  INSERT INTO user VALUES(
    NULL,
    $account ,
    $password ,
    $role ,
    $name ,
    $position ,
    $phone ,
    $email ,
    $comment ,
    $active ,
    $available ,
    $createdTime
  );
  `;
  data.available = true;
  data.createdTime = new Date();
  data.password = dbutil.passEncrypt(data.password);
  return dbutil.excuteParam(sql, data, 'run');
}

/**
 * 得到做验证用户的数据
 * @param data
 */
const getValidUser = (data) => {
  let sql = `
  SELECT * FROM user WHERE account=$account;
  `;
  console.log(data);
  return dbutil.excuteParam(sql, data, 'all');
}

/**
 * 修改密码
 * @param data
 */
const modifyPwd = (data) => {
  let sql = `
  UPDATE user
  SET password=$password ,active=$active
  WHERE id=$id
  ;
  `;
  data.password = dbutil.passEncrypt(data.password);
  return dbutil.excuteParam(sql, data, 'run');
}

/**
 * 根据ID获取用户
 * @param data
 */
const getUserById = (data) => {
  let sql = `
  SELECT * FROM user
  WHERE id=$id
  ;
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

/**
 * 修改用户
 * @param data
 */
const modifyUser = (data) => {
  let sql = `
  UPDATE user SET
    name=$name ,
    position=$position ,
    phone=$phone ,
    email=$email ,
    comment=$comment
  WHERE id=$id
  ;
  `;
  return dbutil.excuteParam(sql, data, 'run');
}

/**
 * 验证用户旧密码是是否正确
 * @param data
 */
const validOldPwd = (data) => {
  let sql = `
  SELECT * FROM user
  WHERE id=$id AND password=$password
  ;
  `;
  data['password'] = dbutil.passEncrypt(data['password']);
  return dbutil.excuteParam(sql, data, 'all');
}

/**
 * 得到所有用户
 */
const getUserList = () => {
  let sql = `
  SELECT
  id,
  user.account,
  user.name,
  user.position,
  select_list.text AS positionName,
  user.phone,
  user.email,
  user.comment,
  user.createdTime,
  user.active
  FROM user , select_list
  WHERE user.position=select_list.value
  AND select_list.name='position'
  AND user.available=1
  AND user.role!='admin'
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'all');
}

/**
 * 根据用户account得到用户的名字
 */
const getUserByAccount = (data)=>{
  let sql = `
  SELECT
  *
  FROM user
  WHERE account=$account
  ;
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

module.exports = {
  getLoginUser,
  addUser,
  getValidUser,
  modifyPwd,
  getUserById,
  modifyUser,
  validOldPwd,
  getUserList,
  getUserByAccount
}
