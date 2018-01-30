/**
 * Created by qiuzhujun on 2018/1/28.
 */
/**
 * 得到模块添加是选项
 * @param account
 */
const getSelect = (account)=>{
  return new Promise((resolve,reject)=>{
    dbmodular.getModularWrite(account)
      .then((accounts)=>dbmodular.getModularWriteUser(accounts))
      .catch((err)=>{
        reject(err)
      })
  })
}

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

module.exports = {
  getSelect,addModular,
  getModular
}
