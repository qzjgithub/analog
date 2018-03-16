/**
 * Created by qiuzhujun on 2018/3/1.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var projectService = require('../service/project/project');
var selectService = require('../service/selectList/selectList');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/:account/write', function(req, res, next) {
  projectService.writeProject(req.params['account'],req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.post('/:account/writeUser', function(req, res, next) {
  projectService.writeProjectUser(req.params['account'],req.body,0,null)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.post('/:account/file', function(req, res, next) {
  console.log(req.query['fileName']);
  // res.status(200).send('ok');
  projectService.writeRemoteFile(req.params['account'],req.query['fileName'],req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.post('/', function(req, res, next) {
  projectService.addProject(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.put('/', function(req, res, next) {
  projectService.modifyProject(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.delete('/:account', function(req, res, next) {
  projectService.deleteProject(req.params['account'],req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/select', function(req, res, next) {
  selectService.getProjectSelect()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/leader', function(req, res, next) {
  projectService.getLeaderProject(req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/related', function(req, res, next) {
  projectService.getRelatedProject(req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/public', function(req, res, next) {
  projectService.getPublicProject(req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/exists', function(req, res, next) {
  return projectService.getProjectExists(req.params['account'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/files', function(req, res, next) {
  return projectService.getFiles(req.params['account'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/file', function(req, res, next) {
  return projectService.getFileContent(req.params['account'],req.query['fileName'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/download', function(req, res, next) {
  //res.download('../data/test/storage.db','storage.db');
});

router.get('/:account/relation', function(req, res, next) {
  projectService.getLoginRelation(req.params['account'],req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account/projectUser', function(req, res, next) {
  projectService.getProjectUser(req.params['account'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/:account', function(req, res, next) {
  projectService.getProjectByAccount(req.params['account'])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

router.get('/', function(req, res, next) {
  projectService.getProjectById(req.query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err)=>{
      res.status(400).send(err);
    })
});

module.exports = router;
