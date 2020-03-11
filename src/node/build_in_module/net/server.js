let net = require('net');
//console.log(net);

let server = net.createServer(socket=>{
   

    socket.on('data',data=>{
        console.log('服务端收到了信息: '+ data)
    });

    console.log('前即将被写入的缓冲的字符数:'+socket.bufferSize+'\n');
    console.log('接受的字节数量：'+socket.bytesRead+'\n');
    console.log('发送的字节数量：'+socket.bytesWritten+'\n');
    console.log('创建socket使用 IPV'+net.isIP('127.0.0.1')+' 协议');
    console.log('remotePort 是：' +socket.remotePort);

    socket.write('这是一条来自于服务端socket的信息！！！')
    socket.end('socket 结束\n');
    
});

/**
 * server.maxConnections
 * 设置该属性使得当 server 连接数过多时拒绝连接。
一旦将一个 socket 发送给 child_process.fork() 生成的子进程，就不推荐使用该选项。
 */
server.maxConnections = 4;                       
server.listen(1024,()=>{
    console.log('TCP服务器开始监听...')
})

server.on('connection',(socket)=>{
   console.log(socket.address())
})

server.on('close',(socket)=>{
    console.log('连接关闭了...')
 })

 server.on('error',(socket)=>{
    console.log('连接出错了...')
 })