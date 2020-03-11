let http = require('http');

let server  = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('子进程：'+process.pid+'被创建');
})

let master;
process.on('message',(message,mainProcess)=>{
   // 判断主进程传送过来的是什么
  if(message=='server'){
      master = mainProcess;
      master.on('connection',socket=>{
          server.emit('connection',socket);
      })
  }
});

server.on('connection',data=>{
    console.log('我是worker:',process.pid,',很高兴为你服务...')
})



process.on('uncaughtException',_=>{
    server.close(_=>{
        process.exit(1);
    })
})