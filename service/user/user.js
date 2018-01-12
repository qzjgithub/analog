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

module.exports = {
  validLoginUser
}
