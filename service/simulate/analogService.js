/**
 * Created by admin on 2018/2/27.
 */
var http = require("http");
var url = require("url");
var service = '';
var account = '';
var port = '';
var req = '';
var res = ''

const onRequest = (request, response) => {
  req = request;
  res = response;
  let method = request.method;
  var pathname = url.parse(request.url).pathname;
  console.log("Request for " + pathname + " received.");

  console.log(account);
  process.send({ type: 'fullPath', account: account ,url: request.url ,method: method});
}

service = http.createServer(onRequest);
service.on('close',function(){
  console.log('server close');
});

process.on('message',(m)=>{
  switch(m['type']){
    case 'start':
      account = m['account'];
      port = m['port'];
      service.listen(port);
      console.log("Server has started.");
      break;
    case 'fullPath':
      if(m.err){
        back(err,400);
      }else{
        if(m.data.length){
          process.send({ type: 'analog', account: account ,parent: m.data[0]['id']});
        }else{
          process.send({ type: 'reg', account: account ,url: req.url ,method: req.method});
        }
      }
      break;
    case 'reg':
      if(m.err){
        back(err,400);
      }else{
        let useData = '';
        for(let i=0;i<m.data.length;i++){
          let d = m.data[i];
          if(new RegExp(d.reg).test(req.url)){
            useData = d;
            break;
          }
        }
        if(useData){
          process.send({ type: 'analog', account: account ,parent:useData['id']});
        }else{
          back({ message: 'no have used interfaces'},400);
        }
      }
      break;
    case 'analog':
      if(m.err){
        back(err,400);
      }else{
        if(m.data.length){
          dealAnalog(m.data[0]);
        }else{
          back({ message: 'no have used analog'},400);
        }
      }
      break;
    default:
      console.log(m);
  }
});

const dealAnalog = (analog)=>{
  console.log(analog);
  var text,code = 200;
  switch(analog.saveType){
    case 'text':
      try{
        console.log(analog.data);
        text = JSON.parse(analog.data);
      }catch(err){
        console.log(err);
        text = analog.data;
      }
      break;
    case 'file':
      text = JSON.parse(analog.data);
      break;
    case 'table':
      text = {msg:'待实现!'};
      break;
    default:
      text = {msg:'no data'};
  }
  back(text,code);
}

const back = (text,code)=>{
  console.log(code);
  let type = typeof text == 'object' ? "application/json;":"text/plain;";
  res.writeHead(code, {"Content-Type": type + ";charset=UTF-8"});
  res.write(typeof text == 'object'?JSON.stringify(text):text,'utf8');
  res.end();
}
