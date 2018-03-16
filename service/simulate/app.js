/**
 * Created by qiuzhujun on 2018/2/27.
 */
console.log(0)
var express = require('express');
console.log(1)
var path = require('path');
console.log(2)
var favicon = require('serve-favicon');
console.log(3)
var logger = require('morgan');
console.log(4)
var cookieParser = require('cookie-parser');
console.log(5)
var bodyParser = require('body-parser');
console.log(6)
/*
var index = require('./routes/index');
var users = require('./routes/users');
*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));*/
app.use(express.json({limit: '5mb'}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../dist')));

/*app.use('/', index);
app.use('/users', users);*/

/*// catch 404 and forward to error handler
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
});*/

module.exports = app;
