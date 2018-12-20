let http = require('http');
let port = 2048;
let host = '127.0.0.1';
let server = http.createServer((req,res)=>{
    // res.writeHead(200,{'Content-Type:':'text/plain'});
    res.end('Hello World');
});
server.listen(port,host);
server.on('request',req=>{
    console.log( req)
})
console.log('Server running at '+ host +":"+ port);