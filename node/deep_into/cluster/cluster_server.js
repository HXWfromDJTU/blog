let cluster = require('cluster');
let http = require('http');
 cluster.setupMaster({
     exec:'server.js'
 });

 let cpus = require('os').cpus();

 if(cluster.isMaster){
     for(let i=0;i<cpus.length;i++){
         cluster.fork();
     }
     cluster.on('PROCESS EXIT',(worker,code,singal)=>{
         console.log('worker'+worker.process.pid + 'die')
     })
 }else{
     console.log('123')
let server = http.createServer((req,res)=>{
    res.writeHead(200);
    res.end("hello world");
}).listen("9527");
 }


 console.log('一共启动了'+ cpus.length + '个进程');

