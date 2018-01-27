  /**
 * Created by qiuzhujun on 2018/1/28.
 */
const getModularWrite = (account)=>{
  let sql = `
  SELECT userAccount FROM user_relation ur
  WHERE
  (ur.type='project' AND ur.relation='participant')
  OR
  (ur.type!='project' AND ur.relation!='concern')
  ;`;
  return dbutil.excuteProjectParam(sql,account,{},'all');
}

const getModularWriteUser = (accounts)=>{
  accounts.map((item)=>{
    return `'`+item+`'`;
  })
  let sql = `
  SELECT * FROM user
  WHERE account in(`+accounts.join(',')+`)
  ;
  `;
  return dbutil.excuteParam(sql, {}, 'run');
}

/**
 * 根据名字得到模块
 * @param data
 */
const getModularByName = (account,data)=>{
  let sql = `
  SELECT * FROM modular
  WHERE name=$name
  ;`;
  return dbutil.excuteProjectParam(sql,account,data,'all');
}

/**
 * 添加一个模块
 * @param account
 * @param data
 */
const addModular = (account,data)=>{
  let sql = `
  INSERT INTO modular VALUES(
    NULL,
    $name ,
    $url ,
    $parent ,
    $comment ,
    $creator ,
    $createdTime
  );
  `;
  data['createdTime'] = new Date();
  return dbutil.excuteProjectParam(sql,account,data,'run');
}
module.exports = {
  getModularWrite,getModularWriteUser,
  getModularByName,addModular
}
