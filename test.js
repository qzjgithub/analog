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

/*const sqlite3 = require('sqlite3').verbose();*/
/*const fs = require('fs');
fs.mkdirSync('data/MMS001');*/
/*const fs = require('fs');
const removeDir = (prefix,name) => {
  let path = prefix + name;
  return new Promise((resolve,reject)=> {
    fs.existsSync(path) && fs.readdir(path, (err, files) => {
      let rmfile = function (i) {
        if (i < files.length) {
          let stat = fs.lstatSync(path + '/' + files[i]);
          if (stat.isDirectory()) {
            removeDir(path + '/', files[i])
              .then(() => {
                rmfile(++i);
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              })
          } else {
            fs.unlink(path + '/' + files[i], (err) => {
              console.log(err);
              if (!err) {
                rmfile(++i);
              }else{
                reject(err);
              }
            })
          }
        } else {
          fs.rmdir(path, (err) => {
            if (err) {
              reject();
            } else {
              resolve();
            }
          });
        }
      }
      rmfile(0);
    })
  })
}

removeDir('data/','test');*/
