let http = require('http');

let server  = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('有一个请求被子进程：'+process.pid+'接受了');
})

let worker;
process.on('message',(message,tcp)=>{
  if(message=='server'){
      worker = tcp;
      worker.on('connection',socket=>{
          server.emit('connection',socket);
      })
  }
});

process.on('uncaughtException',_=>{
    worker.close(_=>{
        process.exit(1);
    })
})