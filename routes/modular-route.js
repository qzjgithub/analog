/**
 * Created by qiuzhujun on 2018/3/2.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var modularService = require('../service/modular/modular');
var selectService = require('../service/selectList/selectList');

router.post('/:account', function(req, res, next) {
  console.log(req.params['account']);
  modularService.addModular(req.params['account'],req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.delete('/:account/:id', function(req, res, next) {
  modularService.getModularById(req.params['account'],req.params)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/:id', function(req, res, next) {
  modularService.getModularById(req.params['account'],req.params)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account', function(req, res, next) {
  modularService.getModular(req.params['account'],req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

module.exports = router;
