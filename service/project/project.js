/**
 * Created by admin on 2018/1/23.
 */
/**
 * 验证项目是否存在
 * @param data
 */
const validExistProject = (data) => {
  return new Promise((resolve, reject)=>{
    dbproject.getValidProject({account: data.account})
      .then((data)=>{
        if(data.length){
          reject({ message:'已存在相同代号的项目' })
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
 * 添加项目
 * @param data
 */
const addProject = (data) => {
  let leader = data['leader'];
  delete data['leader'];
  let related = {
    projectAccount : data.account,
    userAccount : leader,
    relation : 'leader'
  }
  return new Promise((resolve, reject)=>{
    validExistProject(data)
      .then(() => dbproject.addProject(data))
      .then(() => dbproject.addProjectUserRelated(related))
      .then(() => dbutil.initProject(Object.assign({},data,{leader: leader})))
      .then(() => resolve())
      .catch((err) => reject(err));
  })
}

module.exports = {
  validExistProject,addProject
}
