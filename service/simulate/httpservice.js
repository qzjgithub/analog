/**
 * Created by admin on 2017/11/6.
 */
var http = require("http");
var url = require("url");

process.on('message',(m)=>{
  let onRequest = (request, response) => {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    console.log(m.account);
    route(request,response,m.account);

    /*response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();*/
  }

  var service = http.createServer(onRequest);
  service.on('close',function(){
    console.log('server close');
  })
  service.listen(m.port);
  console.log("Server has started.");
});

const route = (request, response, account)=>{
  console.log('enter in');
  let method = request.method;
  let pathname = url.parse(request.url).pathname;
  console.log("About to route a request for " + pathname);
  dbinterfaces.getInterfacesByFullPathAndMethod(account,{ fullPath: request.url,method: method}).then((data)=>{
    if(data.length){
      getActiveAnalog(account,data[0],response);
    }else {
      dbinterfaces.getInterfacesByRegAndMethod(account,{ method: method }).then((regData)=>{
        let useData = '';
        for(let i=0;i<regData.length;i++){
          let regInterfaces = regData[i];
          let reg = new RegExp(regInterfaces['reg']);
          if(reg.test(request.url)){
            useData = useData || regInterfaces;
            break;
          }
        }
        if(useData){
          getActiveAnalog(account,useData,response);
        }else {
          let text = {err:{message:'无对应接口'}};
          let code = 400;
          back(text,code,res);
        }
      }).catch((err)=>{
        let text = {err:err};
        let code = 400;
        back(text,code,res);
      });
    }
  }).catch((err)=>{
    let text = {err:err};
    let code = 400;
    back(text,code,res);
  });
}

const getActiveAnalog = (account,interfaces,res)=>{
  dbanalog.getActiveAnalogByParent(account,{parent: interfaces.id}).then((intdata)=>{
    dealIntdata(intdata,res);
  })
    .catch((err)=>{
      let text = {err:"无模拟数据"};
      let code = 400;
      back(text,code,res);
    })
}

const dealIntdata = (intdata,res)=>{
  var text,code = 200;
  switch(intdata.saveType){
    case 'text':
      try{
        text = JSON.parse(intdata.data);
      }catch(err){
        console.log(err);
        text = intdata.data;
      }
      break;
    case 'file':
      text = JSON.parse(intdata.data);
      break;
    case 'table':
      text = {msg:'待实现!'};
      break;
    default:
      text = {msg:'no data'};
  }
  code = intdata.code;
  console.log(code);
  back(text,code,res);
}

const back = (text,code,res)=>{
  console.log(code);
  let type = typeof text == 'object' ? "application/json;":"text/plain;";
  res.writeHead(code, {"Content-Type": type + ";charset=UTF-8"});
  res.write(typeof text == 'object'?JSON.stringify(text):text,'utf8');
  res.end();
}

// window['projectdb'].update(project.id,{status: 'start'});

