const generateMessage = async (
  { sender,
    projectAccount,
    userAccount,
    modularId,
    interfacesId,
    resType,
    resResult
  },operate,level
) => {
  let userTxt = [], projectTxt = [], content = '';
  let project, modular, interfaces, user;
  switch(level){
    case 0:
      //实现项目外的信息提示
      break;
    case 4:
      //实现模拟数据级的信息提示
      projectTxt.unshift('模拟数据');
    case 3:
      //实现接口级的信息提示
      interfaces = await dbinterfaces.getInterfacesById(projectAccount,{ id: interfacesId });
      interfaces = interfaces.length ? {} : interfaces[0];
      projectTxt.unshift((interfaces.id ? (`${interfaces['method']} ${interfaces['fullPath']}`):'未知')+' 接口');
    case 2:
      //实现模块级的信息提示
      modular = await dbmodular.getModularById(projectAccount, { id: modularId });
      modular = modular.length ? {} : modular[0];
      projectTxt.unshift( (modular.name || '未知') + '模块');
    case 1:
      //实现项目级的信息提示
      project = await dbproject.getProjectByAccount(projectAccount);
      project = project.length ? {} : project[0];
      projectTxt.unshift( (project.name||'未知') + '项目');
      break;
  }

  user = await dbuser.getUserByAccount({ account: userAccount });
  user = user.length ? {} : user[0];
  userTxt.push( (user.name || '未知') );

  switch(operate){
    case 'add':
      content.push( '添加' );
      break;
    case 'modify':
      content.push( '修改' );
      break;
    case 'delete':
      content.push( '删除' );
      break;
    case 'default':
      content.push( '操作' );
      break;
  }
  userTxt.push('了');

  let last = projectTxt.pop();
  content = userTxt.join() + projectTxt.join('，') + '的' + last;
}

module.exports = {
  generateMessage
}
