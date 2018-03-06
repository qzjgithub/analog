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
/*const fs = require('fs');
const removeDir = (prefix,name,level,theres) => {
  let path = prefix.join('') + name;
  console.log(path);
  return new Promise((resolve,reject)=> {
    fs.existsSync(path) && fs.readdir(path, (err, files) => {
      if(files.length){
        theres = theres || resolve;
        let file = files.shift();
        let stat = fs.lstatSync(path + '/' + file);
        if(stat.isDirectory()){
          prefix.push(name+'/')
          removeDir(prefix,file,level+1,theres);
        }else{
          fs.unlink(path + '/' + file, (err) => {
            if (!err) {
              removeDir(prefix,name,level,theres);
            }else{
              reject(err);
            }
          })
        }
      }else{
        fs.rmdir(path, (err) => {
          if (err) {
            reject();
          } else {
            resolve();
          }
          console.log(level, prefix);
          if(level!=0){
            let n = prefix.pop().replace('/','');
            removeDir(prefix,n,level-1, theres);
          }else{
            theres && theres();
          }
        });
      }
    })
  })
}

removeDir(['data/'],'a',0)
  .then(()=>{
    console.log('ok');
  })
  .catch((err)=>{
    console.log(err.message);
  })*/
/*const fs = require('fs');
var num = 0;

fs.readFile('config/config.json',(err,data)=>{
  if(err){
    console.log(err);
  }else{
    console.log('{"result":"ok"}');
    process.exit(1);
    num++;
  }
});
process.stdin.on('data',(data)=>{
  let text = data.toString();
  console.log(text);
})*/

/*
process.stdout.on('data',(data)=>{
  console.log(new String(data));
  //process.exit(1);
  //subprocess.stdin.write('parent in');
});

process.stderr.on('data', (data) => {
  console.log(`ps stderr: ${data}`);
});

process.on('close', (code) => {
  if (code !== 0) {
    console.log(`test 进程退出码：${code}`);
  }
  //subprocess.stdin.end();
});
*/

var fs=require('fs');

/*var fileReadStream=fs.createReadStream('config/config.json');

fileReadStream.on('data',function(data){
  console.log(data.toString().length);
  console.log(data.toString());
});

fileReadStream.on('end',function(){
  console.log("readStream end");
});*/

/*fs.readdir('data/test',(err,files)=>{
  if(err){
    console.log(err);
  }else{
    console.log(files[0]);
  }
});*/
