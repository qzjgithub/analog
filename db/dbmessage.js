const addMessage = (data)=>{
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
  data.projectAccount = data.projectAccount || '';
  data.userAccount = data.userAccount || '';
  data.modularId = data.modularId || '';
  data.interfacesId = data.interfacesId || '';
  data.resType = data.resType || '';
  data.resResult = data.resResult || '';
  data.read = false;
  data.createdTime = data.createdTime || new Date();
  return dbutil.excuteParam(sql, data, 'run');
}

module.exports = {
  addMessage
}
