/**
 * Created by qiuzhujun on 2017/11/5.
 */
/*var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
    stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    console.log(row.id + ": " + row.info);
  });
});

db.close();*/

/*const dbutil = require('../db/dbutil');
dbutil.initSystem();*/

/*const fs = require('fs');
fs.writeFile('test.txt',JSON.stringify({test:'aaa'}),(err,data)=>{
  if(err){
    console.log(err);
  }
  console.log(data);
});*/

const sqlite3 = require('sqlite3').verbose();
