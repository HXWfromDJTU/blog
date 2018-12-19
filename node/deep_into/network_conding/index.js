let net = require('net');
// 创建一个TCP服务器
let server = net.createServer(socket=>{
    socket.on('data',data=>{
        socket.write('hello network coding');
    });

    socket.on('end',data=>{
        console.log('network disconnected');
    })

    socket.write('socket write directly');
})

server.listen(1024,_=>{
    console.log('network established');
})