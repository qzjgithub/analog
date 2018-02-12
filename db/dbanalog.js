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

/**
 * 添加模拟数据
 */
const addAnalog = (account,data)=>{
  let sql = `
  INSERT INTO analog VALUES(
    NULL,
    $saveType ,
    $data ,
    $dataType ,
    $parent ,
    $active ,
    $comment ,
    $creator ,
    $createdTime
  );
  ;`;
  data['createdTime'] = new Date();
  return dbutil.excuteProjectParam(sql,account,data,'run');
}

/**
 * 根据接口id获取模拟数据
 * @param account
 * @param data
 * @returns {Promise}
 */
const getAnalogByParent = (account,data) => {
  let sql = `
  SELECT * FROM analog
  WHERE parent=$parent
  ;
  `;
  return dbutil.excuteProjectParam(sql,account,data,'all');
}
module.exports = {
  deleteAnalogInInterfacesIds,addAnalog,getAnalogByParent
}
