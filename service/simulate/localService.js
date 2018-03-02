#!/usr/bin/env node

/**
 * Module dependencies.
 */
  console.log(global);
global['dbutil'] = require('../../db/dbutil');
global['dbuser'] = require('../../db/dbuser');
global['dbproject'] = require('../../db/dbproject');
global['dbmodular'] = require('../../db/dbmodular');
global['dbinterfaces'] = require('../../db/dbinterfaces');
global['dbanalog'] = require('../../db/dbanalog');

var app = require('./app');
var debug = require('debug')('analog:server');
var http = require('http');
var fs = require('fs');
var service = {};

var testAnalog = require('../../routes/testAnalog');
var userRoute = require('../../routes/user-route');
var projectRoute = require('../../routes/project-route');
var modularRoute = require('../../routes/modular-route');

/**
 * Get port from environment and store in Express.
 */

/*var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);*/

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

/*server.listen(port);*/
server.on('error', onError);
server.on('listening', onListening);

function initServer(){
  let port = normalizePort( service['port'] || '3000');
  app.set('port',port);

  let prefix = service['prefix'];
  app.use(prefix+'/analog/test',testAnalog);
  app.use(prefix+'/analog/user',userRoute);
  app.use(prefix+'/analog/project',projectRoute);
  app.use(prefix+'/analog/modular',modularRoute);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  server.listen(port);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      //console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      //console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/**
 * getConfig
 */
function getConfig(){
  //console.log("enter local service");
  fs.readFile('config/config.json',(err,data)=>{
    if(err){
      console.log('{"result":"fail","message":"read config file failed"}');
      process.exit(1);
    }else{
      data = JSON.parse(data);
      service = data['localService'];
      initServer();
      console.log('{"result":"success"}');
    }
  });
}

getConfig();
