/**
 * Created by admin on 2018/2/2.
 */
/**
 * 根据父模块id获取接口信息
 * @param account
 * @param data
 */
const getInterfacesByParent = (account,data)=>{
  if(data['parent']){
    return dbinterfaces.getInterfacesByParent(account,{ parent: data['parent']});
  }else{
    return dbinterfaces.getInterfacesInProject(account);
  }
}

/**
 * 得到某项目下的所有接口
 * @param account
 * @returns {Promise}
 */
const getInterfacesAll = (account)=>{
  return dbinterfaces.getInterfacesAll(account);
}

/**
 * 添加接口
 * @param account
 * @param data
 */
const addInterfaces = (account,data)=>{
  /*return new Promise((resolve,reject)=>{
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
                let addRelation = (i) => {
                  if(!writers || i>=writers.length){
                    resolve();
                    return;
                  }
                  let writer = writers[i];
                  let relation = {
                    userAccount : writer,
                    type : 'modular',
                    relatedId : id,
                    relation : 'writer'
                  }
                  dbproject.addUserRelation(account,relation)
                    .then(()=>{
                      addRelation(++i);
                    })
                    .catch((err)=>{
                      reject(err)
                    })
                }
                addRelation(0);
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
  })*/
}

module.exports = {
  getInterfacesByParent,getInterfacesAll,addInterfaces
}
