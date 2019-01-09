const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;


let workers = {};

let createWorker = _=>{
    console.log(`主进程 ${process.pid} 正在运行`);
    let worker;
    // 衍生工作进程。
    for (let i = 0; i < numCPUs; i++) {
      worker = cluster.fork();
      workers[worker.pid] = worker;
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`工作进程 ${worker.process.pid} 已退出`);
    });
  }
if (cluster.isMaster) {
    createWorker();
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是 HTTP 服务器。
  let worker_server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('你好世界\n');
  }).listen(8000);

   worker_server.on('connection',socket=>{
       console.log('子进程：'+process.pid+'为你服务');
       throw new Error('来一个错误');
   })
   // 错误捕获
   process.on('uncaughtException',_=>{
       worker_server.close(_=>{
           // 重新再补充开启一个进程
           process.exit(1);
       })
   })

  console.log(`工作进程 ${process.pid} 已启动`);
}


