/**
 * Created by admin on 2017/11/6.
 */
var http = require("http");
var url = require("url");
function onRequest(request, response) {
  var pathname = url.parse(request.url).pathname;
  console.log("Request for " + pathname + " received.");

  /*window['analog'].route(request,response,project);*/

  response.writeHead(200, {"Content-Type": "text/plain"});
   response.write("Hello World");
   response.end();
}

var service = http.createServer(onRequest);
service.on('close',function(){
  console.log('server close');
})

process.on('message',(m)=>{
  service.listen(m.port);
  console.log("Server has started.");
})

// window['projectdb'].update(project.id,{status: 'start'});

