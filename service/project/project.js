/**
 * Created by admin on 2018/1/23.
 */

const fs = require('fs');
const path = require('path');

/**
 * 验证项目是否存在
 * @param data
 */
const validExistProject = (data) => {
  return new Promise((resolve, reject)=>{
    dbproject.getValidProject({account: data.account})
      .then((data)=>{
        if(data.length){
          reject({ message:'已存在相同代号的项目',result: 'exist'})
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
        .then(()=>dbproject.deleteUserRelation(account))
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

/**
 * 下载项目
 * @param account
 */
const downloadProject = (account)=>{

}

/**
 * 得到本地项目的情况
 * @param account
 */
const getProjectExists = (account)=>{
  return new Promise((resolve,reject)=>{
    let result = { db: false, fs: false};
    dbproject.getProjectByAccount({account:account})
      .then((data)=>{
        if(data.length>0){
          result['db'] = true;
        }
        fs.access(`data/${account}`,(err)=>{
          if(!err){
            result['fs'] = true;
          }
          resolve(result);
        });
      })
      .catch((err)=>{
        reject(err);
      });
  });
}

/**
 * 根据项目account得到项目信息
 * @param account
 * @returns {Promise}
 */
const getProjectByAccount = (account) =>{
  return dbproject.getProjectByAccount({account:account});
}

/**
 * 根据项目account得到用户
 * @param account
 */
const getProjectUser = (account) => {
  return dbuser.getProjectUser(account);
}

/**
 * 上传或下载时，写项目信息
 * @param account
 */
const writeProject = (account,data) => {
  return new Promise((resolve,reject)=>{
    dbproject.getValidProject({ account: account })
      .then((p)=>{
        if(p.length){
          dbproject.modifyProject({
            name: data['name'],
            port: data['port'],
            url: data['url'],
            authority: data['authority'],
            comment: data['comment'],
            account: data['account']
          }).then(()=>{
            resolve();
          }).catch((err)=>{
            reject(err);
          });
        }else{
          delete data['id'];
          dbproject.addProject(data)
            .then(()=>{
              resolve();
            }).catch((err)=>{
              reject(err);
            });
        }
      })
      .catch((err)=>{
        reject(err);
      })
  });
}

/**
 * 上传或下载时，写项目和用户关系
 * @param account
 * @param data
 * @param index
 * @param theres
 */
const writeProjectUser = (account,data,index, theres)=>{
  return new Promise((resolve,reject)=>{
    theres = theres || resolve;
    if(index>=data.length){
      theres();
    }else{
      let d = data[index];
      dbuser.getProjectUserExact({
        projectAccount:d['projectAccount'],
        userAccount:d['userAccount']
      }).then((pu)=>{
        if(pu.length){
          dbproject.modifyProjectUserRelated({
            relation: d['relation'],
            projectAccount:d['projectAccount'],
            userAccount:d['userAccount']
          }).then(()=>{
            index++;
            writeProjectUser(account,data,index,theres);
          }).catch((err)=>{
            reject(err);
          })
        }else{
          dbproject.addProjectUserRelated({
            relation: d['relation'],
            projectAccount:d['projectAccount'],
            userAccount:d['userAccount']
          }).then(()=>{
            index++;
            writeProjectUser(account,data,index,theres);
          }).catch((err)=>{
            reject(err);
          })
        }
      })
    }
  });
}

/**
 * 得到项目下所有文件名
 * @param account
 * @returns {Promise}
 */
const getFiles = (account) => {
  return new Promise((resolve,reject)=>{
    fs.readdir(path.join(rootPath,`data/${account}`),(err,files)=>{
      if(err){
        reject(err);
      }else{
        resolve(files);
      }
    });
  });
}

/**
 * 得到文件的具体内容
 * @param account
 * @param fileName
 */
const getFileContent = (account,fileName) => {
  return new Promise((resolve,reject)=>{
    let frs = fs.createReadStream(path.join(rootPath,`data/${account}/${fileName}`),{ flags:"r",encoding:null,mode:0o666 });
    frs.on('data',(data)=>{
      resolve(data);
    });
  });
}

/**
 * 写项目文件
 * @param account
 * @param fileName
 * @param data
 * @returns {Promise}
 */
const writeLocalFile = (account,fileName,data)=>{
  return new Promise((resolve,reject)=>{
    console.log('write file 1');
    if(!fs.existsSync(path.join(rootPath,`data/${account}`))){
      fs.mkdirSync(path.join(rootPath,`data/${account}`));
    }
    console.log('write file 2');
    let fws = fs.createWriteStream(path.join(rootPath,`data/${account}/${fileName}`),{flags: 'a',encoding: null,mode: 0o666 });
    console.log('write file 3');
    console.log(data);
    fws.write(new Blob(data));
    console.log('write file 4');
    /*fws.on('close',()=>{
      resolve();
    })*/
    fws.end('This is the end\n');
    fws.on('finish', () => {
      console.error('All writes are now complete.');
      resolve();
    });
  });
}

const writeRemoteFile = (account,fileName,data)=>{
  return new Promise((resolve,reject)=>{
    console.log('write file 1');
    if(!fs.existsSync(path.join(rootPath,`data/${account}`))){
      fs.mkdirSync(path.join(rootPath,`data/${account}`));
    }
    console.log('write file 2');
    let fws = fs.createWriteStream(path.join(rootPath,`data/${account}/${fileName}`),{flags: 'a',encoding: null,mode: 0o666 });
    console.log('write file 3');
    console.log(data);
    fws.write(new Buffer(data.data));
    console.log('write file 4');
    /*fws.on('close',()=>{
      resolve();
    })*/
    fws.end('This is the end\n');
    fws.on('finish', () => {
      console.error('All writes are now complete.');
      resolve();
    });
  });
}

module.exports = {
  validExistProject,addProject,
  getPublicProject,getLeaderProject,getRelatedProject,
  modifyProject,getLoginRelation,
  deleteProject,getProjectById,
  downloadProject,getProjectExists,
  getProjectByAccount,getProjectUser,
  writeProject,writeProjectUser,
  getFiles,getFileContent,
  writeLocalFile,writeRemoteFile
}
