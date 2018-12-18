// var useMem = function(){
//     var size = 200 * 1024 * 1024;
//     var bufer = new ArrayBuffer(size);
//     for (var i=0;i<size;i++){
//         buffer[i] = 0;
//     }
//     return buffer;
// }
// var str = "你好吗？SwainWong";
// var buf = Buffer.byteLength(str,'utf-8');
// console.log(buf);

var fs = require('fs');
var data = '';
var rs = fs.createReadStream('test.txt',{highWaterMark:11});
rs.setEncoding('UTF-8');
rs.on('data',function(chunk){
    data += chunk;
});

rs.on('end',function(){
    console.log(data)
})