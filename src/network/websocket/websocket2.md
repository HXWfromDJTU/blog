# websocket 项目笔记 - 前端部分 #15 

上一篇主要总结了`鉴权`、`签名`、`心跳`的问题，这次我们着重过一下在封装请求库时遇到的以下问题。

1.对调用方透明，尽可能使用`Promise`封装
2.实现请求与相应的中间件
3.实现订阅机制

## 请求库的封装
```ts
export class RainbowWebsocket extends EventEmitter {
  protected _serverUrl: string // 远端地址
  protected _ws: WebSocket // 原生ws实例

  constructor (option: IOption) {
    super()
    this._serverUrl = option.url
    this._ws = new WebSocket(this._serverUrl)

    this._ws.onmessage = event => {
      console.log(event.data)
    }

    this._ws.onopen = event => {
      this._logger.log(`RainbowWebsocket connected to ${this._serverUrl} successfully......`)
    }
  }

  request (data: any): Promise<any> {}

  response (msg: string) {}
}
```
* promise
* 订阅的队列 （如何实现多频道）
* 通道未建成时的请求

## 异常捕获与重连
* 错误码
* 异常如何捕获

## 推送通知

## 其他
* cookie
* 请求头
* http upgrade


结合promise
异常捕获

如何做安全防范呢？

## 是否有跨域限制？
* 浏览器怎么规定的呢？
* 没有跨域不会不安全吗？


<!-- 对端关闭，另一端是否能够立马知晓
突然中断呢？
   * 断电呢？
   * 手动退出呢？
   * 是否可以直接参考TCP四次挥手的几种情况。

心跳机制如何去做呢？ -->

<!-- ## websocket 与安全
http 101 upgrade 是那一部分进行处理的呢？
    - 程序框架还是 NGINX？
    - 101 请求是否会被 CSRF
    - 如何进行签名
    - 为何浏览器操作不了101请求（头字段添加） -->
























<!-- ![](/blog_assets/websocket_cover.png)
### 从前的替代方案
1️⃣ `长短轮询` 
当`websocket`还没有出现的时候，我们需要实时接收来自于服务器的信息时，通常会使用`长轮询`的策略。  
2️⃣ `http流` 
##### 长短轮询
1️⃣ 是客户端发送一个http请求到服务端，然后保持连接的选项打开。服务器接受到请求后，会一直保持链接的打开状态，直到服务器在稍后返回信息，然后一次长轮询结束。   
2️⃣ 客户端收到信息之后，会马上在此发起下一次长轮询请求。 


![](/blog_assets/long_pull.png) 
3️⃣ 短轮询就是我们最容易理解的，客户端不断发送请求到服务端，询问最新情况的方法，请求数目会大大增加。  
##### http流 
1️⃣ 不同于轮询，http的特点是指打开一个请求，然后保持请求的打开，然后周期性地向浏览器发送数据,这就是我们所说的`Commet`。  
2️⃣ 在`Commet`基础上，`SSE`是浏览器所支持的`服务端推送的实现方案`。
![](/blog_assets/SSE_1.png)  
![](/blog_assets/SSE_2.png)    

##### 缺点
1️⃣ 并不是正式的手法，而是类与`hacks`手法来实现实时通信。
2️⃣ 会消耗更多的资源，如`CPU`、`内存`和`带宽`等。

### Html5时代的 web socket
#### 兼容性 
![](/blog_assets/websocket_capacity.png) 
#### 优点
1️⃣ 浏览器与服务器的全双工(full-duplex)
2️⃣ 最初建立需要`http`协议的的协助，其他时候直接基于`TCP`完成通信
3️⃣ 不适用http协议的好处是，可以不详http那样携带大量的无用数据，传送的数据包比较小，更适合移动端的开发。  
4️⃣ 可以使用数据流的形式实现各种应用数据交换  

#### 缺点
1️⃣ 也不再享有在一些本由浏览器提供的服务和优化，如状态管理、压缩、缓存等  
2️⃣ 因为Web Socket协议不同于http协议，所以现有的服务器是不能够直接用于Websocket通信的(另外要添加插件兼容)。在不允许使用 `Websocket`的情况下，使用`xhr`+`SSE`也可以实现双向通信。   

#### 其他附属点
1️⃣ 使用`new`关键字返回的是一个socket连接的句柄，我们可以在句柄上监听事件，常见有`error` `open` `close`事件。  
2️⃣ `error`事件可以返回的event参数中，附带了`wasClean` `code`  `reason`属性，用于给调用者分析错误日志。  

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
1️⃣ ws协议：普通请求，占用与http相同的80端口
2️⃣ wss协议：类似于https,基于SSL的安全传输，占用与tls相同的443端口

### 相关类库
`Socket.io`针对不同浏览器对`Websocket`的支持不同，抹平了差异性，为实施应用提供跨平台实时通信的库。

## 总结
`Websocket`协议为实时通信双向通信而设计，提供了高效、灵活的文本和二进制数据传输，同时也错过了浏览器为http提供的一些服务，在使用时需要应用自己实现。Websocket不能完全替代HTTP、XHR等机制，开发时候需要权衡各种方式的优缺点来达到最好的实践。 -->

<!-- ### 参考文章
[WebSocket 浅析](https://juejin.im/entry/58bd0579128fe1007e5c62c7)  
[Javascript高级程序设计 - 第三版]() -->
