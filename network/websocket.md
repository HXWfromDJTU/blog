# websocket

### 从前的替代方案--长轮询
当`websocket`还没有出现的时候，我们需要实时接收来自于服务器的信息时，通常会使用`长轮询`的策略。
#### 什么是长轮询
也就是客户端发送一个http请求到服务端，然后保持连接的选项打开，以保证服务器可以在稍后的时间去返回信息。
#### 缺点
* 并不是正式的手法，而是类与'hacks'手法来实现实时通信。
* 会消耗更多的资源，如`CPU`、`内存`和`带宽`等。

### Html5时代的 websocket
#### 优点
* 浏览器与服务器的全双工(full-duplex)
* 最初建立需要`http`协议的的协助，其他时候直接基于`TCP`完成通信
* 极简单的API，最通用，最灵活
* 可以使用数据流的形式实现各种应用数据交换

#### 缺点
* 也不再享有在一些本由浏览器提供的服务和优化，如状态管理、压缩、缓存等

### 常用Api
#### 发送端
```js
// 创建连接
var ws = new Websocket('wss://api.com/newRecord');
// 连接出现错误处理
ws.onerror  = function(error){}
// 连接关闭时调用
ws.onclose = function(){}
// 连接建立的时候调用
ws.onopen =function(){}
// 发送消息
ws.send("这是一条发送给服务器的信息......");
ws.onmessage = function(msg){
    if(msg.data instanceof Blob){
        // 处理二进制信息
        processBlob(msg.data);
    }else{
        // 获得文本信息
        processTest(msg.data)
    }
}
```
#### 传输过程
`websocket`支持文本和二进制传输，浏览器如果接收到文本数据，则会将数据转换为`DOMString`对象，如果是`二进制数据`或者`Blob`对象，可以直接将其转交给应用或将其转化为`ArrayBuffer`。
#### 接收端
```js
ws.onopen = function(){
    socket.send("Hello server!"); 
  socket.send(JSON.stringify({'msg': 'payload'}));

  var buffer = new ArrayBuffer(128);
  socket.send(buffer);

  var intview = new Uint32Array(buffer);
  socket.send(intview);

  var blob = new Blob([buffer]);
  socket.send(blob); 
}
```
### WS 与 WSS
* ws协议：普通请求，占用与http相同的80端口
* wss协议：基于SSL的安全传输，占用与tls相同的443端口

### 相关类库
Socket.io针对不同浏览器对Websocket的支持不同，抹平了差异性，为实施应用提供跨平台实时通信的库。

## 总结
Websocket协议为实时通信双向通信而设计，提供了高效、灵活的文本和二进制数据传输，同时也错过了浏览器为http提供的一些服务，在使用时需要应用自己实现。Websocket不能完全替代HTTP、XHR等机制，开发时候需要权衡各种方式的优缺点来达到最好的实践。

### 参考文章
[WebSocket 浅析](https://juejin.im/entry/58bd0579128fe1007e5c62c7)