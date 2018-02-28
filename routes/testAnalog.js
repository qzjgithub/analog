/**
 * Created by qiuzhujun on 2018/2/28.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('OK');
  res.status(200).send({result: 'ok'});
});

module.exports = router;
