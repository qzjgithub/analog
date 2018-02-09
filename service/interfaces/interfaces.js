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
  return new Promise((resolve,reject)=>{
    dbinterfaces.getInterfacesByUrlAndMethod(account,{url: data['url'],method:data['method'],parent: data['parent']})
      .then((item)=>{
        if(item.length){
          reject({message:'已存在相同路径和请求类型的接口'})
        }else{
          let writers = data['writer'];
          let d = Object.assign({},data);
          delete d['writer'];
          d['reg'] = '';
          if(d['fullPath'].match(/{.+?}/g)){
            let reg = d['fullPath'];
            reg = reg.replace(/\//g,'\\/');
            reg = reg.replace(/{.+?}/g,'.+?');
            d['reg'] = reg;
          }
          dbinterfaces.addInterfaces(account,d)
            .then(()=>dbinterfaces.getInterfacesByUrlAndMethod(account,{url: data['url'],method:data['method'],parent: data['parent']}))
            .then((m)=>{
              if(!m.length) {
                reject({message: '不可能'});
              }else{
                let id = m[0]['id'];
                addInterfacesRelation(account,id,writers,resolve);
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

const addInterfacesRelation = (account,id,writers,theres)=>{
  return new Promise((resolve,reject)=>{
    if(writers && writers.length){
      theres = theres || resolve;
      let writer = writers.shift();
      let relation = {
        userAccount : writer,
        type : 'interfaces',
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
 * 根据模块id得到此模块的全路径
 * @param account
 * @param id
 * @param path
 */
const getFullPathByModularId = (account,id,path,theres)=>{
  path = path || [];
  return new Promise((resolve,reject)=>{
    if(!id){
      resolve([]);
      return;
    }
    dbmodular.getModularById(account,{id:id})
      .then((data)=>{
        if(data.length){
          path.unshift(data[0]['url']);
          if(data[0]['parent']){
            getFullPathByModularId(account,data[0]['parent'],path,theres || resolve);
          }else{
            resolve(path)
            theres && theres(path);
          }
        }else{
          resolve(path);
          theres && theres(path);
        }
      })
      .catch((err)=>{
        reject(err);
      })
  });
}

/**
 * 根据id得到接口
 * @param account
 * @param data
 */
const getInterfacesById = (account,data)=>{
  return new Promise((resolve,reject)=>{
    dbinterfaces.getInterfacesById(account,data)
      .then((inerfaces)=>{
        if(inerfaces.length){
          dbuser.getUserByAccount({ account: inerfaces[0]['creator']})
            .then((user)=>{
              if(user.length){
                inerfaces[0]['creatorName'] = user[0]['name'];
              }else{
                inerfaces[0]['creatorName'] = '未知';
              }
              resolve(inerfaces[0]);
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

module.exports = {
  getInterfacesByParent,getInterfacesAll,addInterfaces,
  getFullPathByModularId,
  getInterfacesById
}
