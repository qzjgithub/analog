/**
 * Created by qiuzhujun on 2018/3/2.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var analogService = require('../service/analog/analog');
var selectService = require('../service/selectList/selectList');

router.post('/:account', function(req, res, next) {
  analogService.addAnalog(req.params['account'],req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.delete('/:account/:id', function(req, res, next) {
  analogService.deleteAnalogById(req.params['account'],req.params['id'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/select', function(req, res, next) {
  selectService.getAnalogSelect()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account', function(req, res, next) {
  analogService.getAnalogByParent(req.params['account'],req.query['parent'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});
module.exports = router;
