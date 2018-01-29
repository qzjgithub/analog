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

/**
 * 得到公共项目
 * @param data
 */
const getPublicProject = (data)=>{
  return new Promise((resolve, reject)=> {
    dbproject.getPublicProject()
      .then((project) => {
        dbproject.getLoginProject({ userAccount: data['login']})
          .then((relpro)=>{
            let relobj = {}
            relpro.forEach((item)=>{
              relobj[item['projectAccount']] = item;
            })
            resolve({ project : project, related : relobj})
          })
          .catch((err)=>{
            reject(err);
          })
      })
      .catch((err) => {
        reject(err);
      })
  })
}

/**
 * 根据ID获取项目信息
 * @param data
 */
const getProjectById = (data) =>{
  return dbproject.getProjectById(data);
}
/**
 * 得到负责的项目
 * @param data
 */
const getLeaderProject = (data) =>{
  return dbproject.getLeaderProject({ userAccount: data.login})
}

/**
 * 得到相关的项目
 * @param data
 */
const getRelatedProject = (data) =>{
  return dbproject.getRelatedProject({ userAccount: data.login})
}

/**
 * 修改项目基本信息
 * @param data
 */
const modifyProject = (data) => {
  return dbproject.modifyProject(data);
}

/**
 * 得到登录者和项目的关系
 * @param account
 * @param data
 */
const getLoginRelation = (account,data)=>{
  return dbproject.getLoginRelation(account,data);
}

/**
 * 删除项目
 * @param account
 * @param del
 */
const deleteProject = (account,del)=>{
  return new Promise((resolve,reject)=>{
    if(del){
      dbutil.removeProjectDir(account)
        .then(()=>dbproject.deleteProjectUser(account))
        .then(()=>dbproject.deleteProject(account))
        .then(()=>{
          resolve();
        })
        .catch((err)=>{
          reject(err);
        })
    }else{
      dbproject.deleteProjectUser(account)
        .then(()=>dbproject.deleteProject(account))
        .then(()=>{
          resolve();
        })
        .catch((err)=>{
          reject(err);
        })
    }
  })
};

module.exports = {
  validExistProject,addProject,
  getPublicProject,getLeaderProject,getRelatedProject,
  modifyProject,getLoginRelation,
  deleteProject,getProjectById
}
