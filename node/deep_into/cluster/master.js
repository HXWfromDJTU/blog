let child_process = require('child_process');
let tcp = require('net');
 let cpus = require('os').cpus();

let server = tcp.createServer();

server.listen('1337');
let workers = {};//设定子线程集合
let createWorker =  _=>{
   let worker = child_process.fork('./worker');
   worker.on('exit',_=>{
      console.log('子进程' + worker.pid +'挂掉了......')
      delete workers[worker.pid];//删除集合中的worker对象
      createWorker();
   })
   // 发送服务器句柄给子进程
worker.send('server',server);
// 存放新启动的worker
worker[worker.pid] = worker;
// 打印日志
console.log('补充创建了子进程'+worker.pid)
}


for(let i =0;i<cpus.length;i++){
   createWorker();
}
// 这里的process 指的是主进程
process.on('exit',_=>{
   for(let pid in workers){
      workers[pid].kill();
   }
});

