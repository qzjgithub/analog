/**
 * Created by qiuzhujun on 2018/3/2.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var interfacesService = require('../service/interfaces/interfaces');
var selectService = require('../service/selectList/selectList');

router.post('/:account', function(req, res, next) {
  interfacesService.addInterfaces(req.params['account'],req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.put('/:account', function(req, res, next) {
  console.log(req.body);
  interfacesService.deleteInterfacesInIds(req.params['account'],req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/select', function(req, res, next) {
  selectService.getInterfacesSelect()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/all', function(req, res, next) {
  interfacesService.getInterfacesAll(req.params['account'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/fullPath', function(req, res, next) {
  interfacesService.getFullPathByModularId(req.params['account'],req.query['id'],null,null)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/list', function(req, res, next) {
  interfacesService.getInterfacesById(req.params['account'],req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account', function(req, res, next) {
  interfacesService.getInterfacesByParent(req.params['account'],req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

module.exports = router;
