let child_process = require('child_process');
let http = require('http');
 let cpus = require('os').cpus();
let port = 1337;
let server = http.createServer((req,res)=>{
   console.log('主进程已经被创建，端口是：'+port)
});
server.listen(port);

// 主进程监听外部请求
server.on('connection',socket=>{
   console.log('master被访问到了，现在准备创建worker');
})



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
workers[worker.pid] = worker;
// 打印日志
console.log('创建了子进程 '+worker.pid+' 用于处理请求')
}

for(let i=0;i<cpus.length;i++){
   createWorker();
}


// 这里的process 指的是主进程
process.on('exit',_=>{
   for(let pid in workers){
      workers[pid].kill();
   }
});

