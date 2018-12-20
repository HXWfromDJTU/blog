let http = require('http');
let option = {
    port:2048,
    hostname:'127.0.0.1',
    path:'/',
    method:'GET'
};

let req = http.request(option,res=>{
    console.log('the response code is'+res.statusCode);
    console.log('Headers'+JSON.stringify(res.headers));
    res.setEncoding('utf-8');
    
    // 设置服务端传输返回数据接收事件
    res.on('data',chunk=>{
        console.log('server response data is '+chunk)
    })
});
let i = 0;
   
        req.write('123')

req.end()