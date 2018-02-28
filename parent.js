/**
 * Created by qiuzhujun on 2018/2/28.
 */
const { spawn } = require('child_process');

const subprocess = spawn(process.argv[0], ['test.js']);
subprocess.stdout.on('data',(data)=>{
  console.log(data);
  console.log(JSON.parse(data));
  let result = JSON.parse(data);
  console.log(result['result']);
  let num = data.toString();
  console.log('in parent'+data.toString());
  if(num=='0\n'){
    console.log('in parent '+num);
    subprocess.stdin.write('parent');
    subprocess.stdin.end();
  }
  if(num==='parent\n'){
    console.log('parent get result');
  }
});

subprocess.stderr.on('data', (data) => {
  console.log(`ps stderr: ${data}`);
});

subprocess.on('close', (code) => {
  if (code !== 0) {
    console.log(`child 进程退出码：${code}`);
  }
  //subprocess.stdin.end();
});
/*
ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.log(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps 进程退出码：${code}`);
  }
  grep.stdin.end();
});*/
