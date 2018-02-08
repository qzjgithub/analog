/**
 * Created by qiuzhujun on 2018/1/28.
 */

/**
 * 添加项目
 * @param account
 * @param data
 */
const addModular = (account, data)=>{
  return new Promise((resolve,reject)=>{
    dbmodular.getModularByName(account,{name: data['name']})
    .then((item)=>{
      if(item.length){
        reject({message:'已存在相同名字的模块'})
      }else{
        let writers = data['writer'];
        let d = Object.assign({},data);
        delete d['writer'];
        dbmodular.addModular(account,d)
        .then(()=>dbmodular.getModularByName(account,{name:data['name']}))
        .then((m)=>{
          if(!m.length) {
            reject({message: '不可能'});
          }else{
            let id = m[0]['id'];
            addModularRelation(account,id,writers,resolve)
          }
        })
          .catch((err)=>{
            reject(err)
          })
      }
    })
      .catch((err)=>{
      reject(err);
      })
  })
}

const addModularRelation = (account,id,writers,theres)=>{
  return new Promise((resolve,reject)=>{
    if(writers && writers.length){
      theres = theres || resolve;
      let writer = writers.shift();
      let relation = {
        userAccount : writer,
        type : 'modular',
        relatedId : id,
        relation : 'writer'
      }
      dbuser.addUserRelation(account,relation)
        .then(()=>{
          addModularRelation(account,id,writers,theres)
        })
        .catch((err)=>{
          theres && theres();
          reject(err)
        })
    }else{
      resolve();
      theres && theres();
    }
  })
}
/**
 * 得到当前要展示的模块
 * @param account
 * @param data
 */
const getModular = (account, data)=>{
  if(!data['parent']){
    return dbmodular.getModularInProject(account, data);
  }else{
    return dbmodular.getModularByParent(account,data);
  }
}

/**
 * 根据ID获取模块信息
 * @param account
 * @param data
 */
const getModularById = (account, data)=>{
  return new Promise((resolve,reject)=>{
    dbmodular.getModularById(account,data)
    .then((modular)=>{
      if(modular.length){
        dbuser.getUserByAccount({ account: modular[0]['creator']})
        .then((user)=>{
          if(user.length){
            modular[0]['creatorName'] = user[0]['name'];
          }else{
            modular[0]['creatorName'] = '未知';
          }
          resolve(modular[0]);
        })
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
 * 删除模块
 * @param account
 * @param data
 */
const deleteModular = (account,data)=>{
  return new Promise((resolve,reject)=>{
    dbmodular.getModularByParent(account,{ parent: data['id']})
    .then((modulars)=>{
      if(modulars.length){
        reject({ message: '该模块下存在子模块，不可删除'});
      }else{
        dbinterfaces.getInterfacesByParent(account,{ parent: data['id']})
          .then((interfaces)=> {
            if (interfaces.length) {
              reject({message: '该模块下存在接口，不可删除'});
            } else {
              dbmodular.deleteModular(account,data)
              .then(()=>{
                resolve();
              })
              .catch((err)=>{
                reject(err);
              })
            }
          })
          .catch((err)=>{
            reject(err);
          })
      }
    })
    .catch((err)=>{
      reject(err);
    })
  })
}

module.exports = {
  addModular,
  getModular,
  getModularById,
  deleteModular
}
