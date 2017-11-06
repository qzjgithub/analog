/**
 * Created by admin on 2017/11/6.
 */
const cp = require('child_process');
const n = cp.fork(`${__dirname}/httpservice.js`);
n.send({port:8090});
const n2 = cp.fork(`${__dirname}/httpservice.js`);
n2.send({port:8091});
