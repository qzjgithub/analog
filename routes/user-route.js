/**
 * Created by qiuzhujun on 2018/3/1.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var userService = require('../service/user/user');
var selectService = require('../service/selectList/selectList');

router.post('/login', function(req, res, next) {
  console.log(req.body);
  userService.validLoginUser(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      console.log(err);
      res.status(400).send(err);
    })
});

router.post('/', function(req, res, next) {
  userService.addUser(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.put('/password', function(req, res, next) {
  userService.modifyPwdUser(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.put('/reset', function(req, res, next) {
  userService.modifyPwdUser(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.put('/oldPwd', function(req, res, next) {
  userService.modifyPwdWithOld(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.put('/', function(req, res, next) {
  userService.modifyUser(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/select', function(req, res, next) {
  console.log('user select enter in')
  selectService.getUserSelect()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/exist', function(req, res, next) {
  userService.validExistUser(req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/account', function(req, res, next) {
  userService.getUserByAccount(req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/writer', function(req, res, next) {
  userService.getWritableUser(req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:id', function(req, res, next) {
  userService.getUserById(req.param)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/', function(req, res, next) {
  userService.getUserList()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

module.exports = router;
