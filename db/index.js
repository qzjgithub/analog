/**
 * Created by admin on 2018/1/12.
 */
var rootPath = require('fs').existsSync('resources') ? 'resources/app/': '';
const dbutil = require('../db/dbutil');
const dbuser = require('../db/dbuser');
const dbproject = require('../db/dbproject');
const dbmodular = require('../db/dbmodular');
const dbinterfaces = require('../db/dbinterfaces');
const dbanalog = require('../db/dbanalog');
const dbmessage = require('../db/dbmessage');

var analogService = {};
var localService;
var sessionLogin = {};
