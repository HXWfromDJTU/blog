let http = require('http');

let server = http.createServer((req,res)=>{
    res.writeHead(200);
    res.end("hello world");
});


server.listen("9527");