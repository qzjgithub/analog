var _arguments = arguments,
    _this = this;

/**
 * 生成message
 * @param sender
 * @param projectAccount
 * @param userAccount
 * @param modularId
 * @param interfacesId
 * @param resType
 * @param resResult
 * @param operate
 * @param level
 * @returns {Promise<void>}
 */
const generateMessage = async (option, operate, level) => {
  let projectAccount = option['projectAccount'];
  let userAccount = option['userAccount'];
  let modularId = option['modularId'];
  let interfacesId = option['interfacesId'];

  let userTxt = [],
      projectTxt = [],
      content = '';
  let project, modular, interfaces, user;
  switch (level) {
    case 0:
      //实现项目外的信息提示
      break;
    case 4:
      //实现模拟数据级的信息提示
      projectTxt.unshift('模拟数据');
    case 3:
      //实现接口级的信息提示
      interfaces = await dbinterfaces.getInterfacesById(projectAccount, { id: interfacesId });
      interfaces = interfaces.length ? {} : interfaces[0];
      projectTxt.unshift((interfaces.id ? `${interfaces['method']} ${interfaces['fullPath']}` : '未知') + ' 接口');
    case 2:
      //实现模块级的信息提示
      modular = await dbmodular.getModularById(projectAccount, { id: modularId });
      modular = modular.length ? {} : modular[0];
      projectTxt.unshift((modular.name || '未知') + '模块');
    case 1:
      //实现项目级的信息提示
      project = await dbproject.getProjectByAccount(projectAccount);
      project = project.length ? {} : project[0];
      projectTxt.unshift((project.name || '未知') + '项目');
      break;
  }

  user = await dbuser.getUserByAccount({ account: userAccount });
  user = user.length ? {} : user[0];
  userTxt.push(user.name || '未知');

  switch (operate) {
    case 'add':
      content.push('添加');
      break;
    case 'modify':
      content.push('修改');
      break;
    case 'delete':
      content.push('删除');
      break;
    case 'default':
      content.push('操作');
      break;
  }
  userTxt.push('了');

  let last = projectTxt.pop();
  content = userTxt.join() + projectTxt.join('，') + '的' + last;
  let date = new Date();
  return new Promise((resolve, reject) => {
    dbmessage.addMessage(Object.assign(_arguments[0], { content: content, createdTime: date })).then(() => dbmessage.getMessageByCreatedTime(date)).then(message => {
      if (message.length) {
        message = message[0];
        resolve(message);
      } else {
        resolve(null);
      }
    }).catch(err => {
      reject(err);
    });
  });
};

/**
 * 将消息与关注者相连
 * @param message
 */
const contactMessageUser = message => {
  _this.getFollowUser(message).then(relations => {
    relations = Array.from(new Set(relations));
    _this.addMessageUser(message['id'], relations, 0, null);
  }).catch(err => {
    console.log(err);
  });
};

/**
 * 获取相关内容的关注者
 * @param sender
 * @param projectAccount
 * @param userAccount
 * @param modularId
 * @param interfacesId
 * @param resType
 * @param resResult
 * @param level
 */
const getFollowUser = (option, level) => {
  let projectAccount = option['projectAccount'];
  let modularId = option['modularId'];
  let interfacesId = option['interfacesId'];

  return new Promise((resolve, reject) => {
    let relations = [];
    if (level >= 1) {
      dbmessage.getUserRelateion(projectAccount, { type: 'project', relatedId: '' }).then(pr => {
        relations = [...relations, ...pr];
        if (level >= 2) {
          _this.getModularFollow(projectAccount, modularId, null, null).then(mr => {
            relations = [...relations, ...mr];
            if (level >= 3) {
              dbmessage.getUserRelation(projectAccount, { type: 'interfaces', relatedId: interfacesId }).then(ir => {
                relations = [...relations, ...ir];
                resolve(relations);
              }).catch(err => {
                reject(err);
              });
            } else {
              resolve(relations);
            }
          }).catch(err => {
            reject(err);
          });
        } else {
          resolve(relations);
        }
      }).catch(err => {
        reject(err);
      });
    } else {
      resolve(relations);
    }
  });
};

/**
 * 获取模块关注者
 * @param projectAccount
 * @param modularId
 */
const getModularFollow = (projectAccount, modularId, relations, theres) => {
  return new Promise((resolve, reject) => {
    theres = theres || resolve;
    relations = relations || [];
    dbmessage.getUserRelation(projectAccount, { type: 'modular', relatedId: modularId }).then(data => {
      relations = [...relations, ...data];
      dbmodular.getModularById(projectAccount, { id: modularId }).then(modular => {
        modular = modular.length ? {} : modular[0];
        if (modular.parent) {
          _this.getModularFollow(projectAccount, modular.parent, relations, theres);
        } else {
          theres(relations);
        }
      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
};

const addMessageUser = (messageId, relations, index, theres) => {
  return new Promise((resolve, reject) => {
    theres = theres || resolve;
    if (index >= relations.length) {
      theres();
    } else {
      dbmessage.addMessage({ recipient: relations[index], messageId }).then(() => {
        index++;
        _this.addMessageUser(messageId, relations, index, theres);
      }).catch(err => {
        theres(err);
      });
    }
  });
};

/**
 * 根据用户获取消息
 * @param recipient
 */
const getMessageByRecipient = recipient => {
  return dbmessage.getMessageByRecipient({ recipient: recipient });
};

/**
 * 删除消息和用户关联
 * @param data
 */
const deleteMessageUser = data => {
  return dbmessage.deleteMessageUser(data);
};

/**
 * 设置未读/已读标识
 * @param data
 */
const setMessageUserRead = data => {
  return dbmessage.setMessageUserRead(data);
};

module.exports = {
  generateMessage, getFollowUser, getModularFollow, addMessageUser, contactMessageUser,
  getMessageByRecipient, deleteMessageUser, setMessageUserRead
};
