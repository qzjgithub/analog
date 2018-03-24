const addMessage = ( data ) => {
  let sql = `
  INSERT INTO message VALUES(
    NULL,
    $sender ,
    $projectAccount ,
    $userAccount ,
    $modularId ,
    $interfacesId ,
    $content ,
    $resType,
    $resResult,
    $createdTime,
    $read
  );
  `;
  data.sender = data.sender || 'system';
  data.projectAccount = data.projectAccount || '';
  data.userAccount = data.userAccount || '';
  data.modularId = data.modularId || '';
  data.interfacesId = data.interfacesId || '';
  data.resType = data.resType || '';
  data.resResult = data.resResult || '';
  data.createdTime = data.createdTime || new Date();
  return dbutil.excuteParam(sql, data, 'run');
}

/**
 * 根据创建时间查找提示信息
 * @param data
 * @returns {*}
 */
const getMessageByCreatedTime = ( data ) => {
  let sql = `
  SELECT *  
  FROM message 
  WHERE createdTime=$createdTime;
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

/**
 * 根据内容id获取关注者账号
 * @param account
 * @param data
 * @returns {Promise}
 */
const getUserRelateion = ( account, data ) =>{
  let sql = `
  SELECT userAccount 
  FROM user_relation 
  WHERE type=$type 
  AND relatedId=$relatedId  
  AND follow IS TRUE;
  `;
  return dbutil.excuteProjectParam(sql, account, data, 'all');
}

/**
 * 添加消息和提醒者的关系
 * @param data
 */
const addMessageUser = ( data ) => {
  let sql = `
  INSERT INTO message_user VALUES(
    $recipient ,
    $messageId ,
    $read
  );
  `;
  data.read = false;
  return dbutil.excuteParam(sql, data, 'run');
}

/**
 * 根据用户获取消息
 * @param data
 * @returns {Promise}
 */
const getMessageByRecipient = ( data ) => {
  let sql = `
  SELECT m.* , mu.read 
  FROM message_user mu, message m 
  WHERE mu.messageId=m.id 
  AND mu.recipient=$recipient
  `;
  return dbutil.excuteParam(sql, data, 'all');
}

/**
 * 删除消息和用户关联
 * @param data
 */
const deleteMessageUser = ( data ) => {
  let sql = `
  DELETE FROM message_user 
  WHERE recipient=$recipient 
  AND messageId IN (${data['ids'].join(',')})
  `;
  return dbutil.excuteParam(sql, { recipient: data['recipient'] }, 'run');
}

/**
 * 设置未读/已读标识
 * @param data
 */
const setMessageUserRead = ( data ) => {
  let sql = `
  UPDATE message_user SET 
    read=$read  
  WHERE recipient=$recipient 
  AND messageId IN (${data['ids'].join(',')})
  `;
  return dbutil.excuteParam(sql, { recipient: data['recipient'], read: data['read'] }, 'run');
}

module.exports = {
  addMessage,getMessageByCreatedTime,getUserRelateion,addMessageUser,
  getMessageByRecipient,deleteMessageUser,setMessageUserRead
}
