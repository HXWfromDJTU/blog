# websocket

## 前言
最近在做一个行情模块，后端同学建议直接上`websocket`练练手，也符合业界基操。这里就记录一些开发中遇到了一些问题，聊一聊解决方案。这里不再去一点点陈列`websocket`的知识点，主要会围绕项目的痛点来说。    

ps: 食用本文时，建议出发点需要向下沉，从`传输层`开始思考，做类似`http`(应用层)需要完成的事。


## 选型

### 第三方lib
| 端 | 语言 | 框架(lib) | 环境 |
| --- | --- | --- | --- |
| 后端 | Go | gin |  CentOS |
| 前端 | TS | axios | 浏览器|

项目当前的前后端选型如上表，因为`websocket`是一个基于`tcp`的应用层协议，就像`http`客户端服务器约定的`请求头`、`响应头`、`cookie`等约定，和`一发一收`交互形式，`websocket`在使用的时候相当于将这部分约定的权利，重新交给了我们开发者。    

那么如果考虑使用`websockt`的`lib`进行项目构建时，则需要考察该方案在两端是否都有实现的方案，


| 框架(lib) | 服务端支持(Go) | 浏览器支持 | 周下载量 | 包大小 | 其他 |
| --- | --- | --- | --- | --- | --- |
| socket.io | ✅ [go-socket.io](https://github.com/googollee/go-socket.io) | ✅ | 3,309,990  | 55.9 kB | 支持策略退化到Polling |
| ws | ✅ | ❌ | 25,770,149 | 110 kB |

### 原生封装
因为这次的模块是`websocket`尝鲜，所以没有考虑太多，最后决定`前端`这边使用浏览器原生支持`Websocket`对象，根据这次的要求进行简答的封装，先趟趟坑，正式上线后再慢慢考察框架。

开工前，几个前端小伙伴做到了一起，提出了自己对这个`SDK`的期望。

1. 该模块是个人模块，需要考虑需要进行鉴权。
2. 作为调用方，我可不想管你接口是`websocket`还是`http`，请自己在`接口层`封装好。
3. 你作为一个请求`lib`，`req`和`res`的`interceptor`还是要有的吧。
4. 啊呀，我们用`axios`都习惯了，接口返回的是一个请求的`Promise`，这次也最后保持一致吧

办公室不大，后端的同学也听到了讨论，附和到:

1. 这边还需要加个心跳💓机制啊，十分钟吧，没有发送消息，我这边就断开啦。    
2. 虽然，前期我们只做`信道复用`实现无刷新请求。可别忘啦，后期我们还是要做服务端消息推送的。
3. 你们赶紧吧，下下周可就`deadline`了...

嘚嘞，上马开工...

## 鉴权
项目当前的鉴权是依赖用户登录后，服务端下发用户`token`到`cookie`中，搭配`header`中的某个字段进行使用。

### 信道建立时鉴权
由于`websocket`在传输数据的时候，并不存在和`http`协议一样的`cookie`、`request header`机制。但信道建所用的请求，仍是`http`请求，你也一定见过这个请求的报文。

##### 前端视角
![](/blog_assets/websocket_101_cookie.png)

##### 服务端视角
```ts
const crypto = require('crypto');

// 生成 websocket AcceptKey
function generateAcceptKey (websocketReqKey: string): string {
  const magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return crypto.createHash('sha1')
  .update(websocketReqKey + magic)
  .digest('base64');
}
```

```ts

const headerParser = require('parse-headers')

const server = net.createServer(socket => {

  socket.on('data', async chunk => {
    const headers = headerParser(Buffer.from(chunk).toString())

    // 检测到是 websocket 建立信道的请求
    if (headers['upgrade'] && headers['sec-websocket-key']) {
      const secWebSocketAccept = generateAcceptKey(headers['sec-websocket-key'])

      const cookies = header['cookie']

      // 请求用户服务身份验证
      const authorized = await checkAuth(cookie.authToken)

      if (authorized) {
        socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
          'Upgrade: WebSocket\r\n' +
          'Connection: Upgrade\r\n' +
          'Sec-WebSocket-Accept: ' + secWebSocketAccept + '\r\n' +
          '\r\n');
      } else {
        socket.write('HTTP/1.1 403 Unauthorized\r\n' +
          '\r\n');
      }
    } else {
      socket.write('data')
    }
  })
}).listen(serverConfig.port, serverConfig.host);
```

ps: 对应的框架实现，可以参考`ws - npm`模块的`verifyClient`的用法,[传送门👉](https://github.com/websockets/ws/blob/master/lib/websocket-server.js)

### 数据传输时鉴权
数据传输时的鉴权建议基于`信道建立时鉴权`的方案，用户第一次认证后，回传给客户端一个类似`token`的令牌，用户在每一次使用`websocket`进行数据传输时，则需要回传这个`token`到服务端进行验证。

ps: 没有什么神秘的，这里其实相当于实现了个手动`cookie`。


## 心跳机制
首先说明一点，心跳机制在`RFC`协议中没有做规定，原则上一个连接可以无限制时间去连接，但是我们知道，服务器的内存、打开文件数量是有限的，特别是需要在同一个时间服务更多用户，则需要及时发现并断开那些已经`不在线`、`不活跃`的连接。

![](/blog_assets/websocket_keepalive.png)

ps: 比如做一个内部系统、公司大屏什么的，连接数不多，可以不需要心跳机制也行。

### 基础的心跳
* ##### client
   ```js
   const ws = new WebSocket("ws://localhost:9527")

   // 大家都喜欢的 ping-pong
   ws.send('ping')

   // 获取接口版本号来保活
   ws.send({
     jsonrpc: '2.0',
     method: 'version',
     data: null
   })
   ```
* ##### server
   ```js
   socket.on('data', data => {
      if (data === 'ping') {
        resetTimer() // 重置断开计时器
        socket.send('pong') // 发送心跳返回
      }
   })
    ```

### 调皮的nginx
项目开发完的总结会中，查看日志才发现`webscoket`连接从未因为达到过上限`10 min`未发送心跳包而断开，倒是发现不少`60 s`断开的日志。后端同学恍然大悟 ---- `nginx`。

```nginx.conf
proxy_read_timeout 90；
```

为了可以统一在业务代码中处理心跳机制，而不是通过`nginx`来实现，所以我们将针对`websocket`请求的`nginx`配置调整了一下
```nginx.conf
http {
    server {
        location /ws {
            root   html;
            index  index.html index.htm;
            proxy_pass xxx.xxx.xxx.xx:9527;
            proxy_http_version 1.1;
            proxy_connect_timeout 4s;
            proxy_read_timeout 700s;      # 需要比业务心跳更长一点
            proxy_send_timeout 12s;       
            proxy_set_header Upgrade $http_upgrade; 
            proxy_set_header Connection "Upgrade";  
        }
    }
}
```

### 天有不测之风云
你一定知道客户端关闭`webcsocket`的`close`语句
```js
// client
const ws = new WebSocket("ws://localhost:9527")
ws.close() // 关闭连接

// server
const wss = new WebSocket.Server({ port: serverConfig.port });

wss.on('connection', function connection(ws) {
  ws.on('close', function (message) {
     console.log('websocket peer closed', message) // websocket peer closed 1005
  })
})
```
但是在各个种情况下断开的`websocket`，对端又是否能够正常知晓呢？

| 关闭场景 | 出现情况 | 己端是否知晓 |对端是否知晓 | 备注 |
| --- | --- | --- | --- | --- | --- | 
| `ws.close()` | 程序代码主动关闭 | ✅ | ✅ |  |
| `刷新浏览器` | 程序上下文丢失 | ❌ | ✅ |  |
| `关闭浏览器1` | 用户点击关闭浏览器 |❌ | ✅ |  |
| `关闭浏览器2` | `kill 命令`杀死浏览器进程 | ❌ | ✅ |  |
| `突然断网` | `手痒拔网线` `进电梯` | ❌ | ❌ | 心跳机制超时、nginx 设置超时才会被发现，若在超市范围内重新发送了心跳，则相当于没有断开过 |

## 跨域 与 安全
### 原本~~打算~~的方案
原本原方案是在`信道建立`的请求头中，添加自定义的请求签名自定义头字段。这样做可以基本做到发起请求的页面，是出自我们自己的业务代码，而其他伪造请求的代码，会因为得不到签名字段而被后端拦截掉。  

但实践中发现，不同于`http`请求，`websocket`请求的`http Connect-upgrade`请求是浏览器内部发出的，市面上常见的浏览器都不支持我们对请求头进行编写、拓展、删除。  

### 官方建议的方案
首先给出结论
> webSocket本身不存在跨域问题，所以我们可以利用webSocket来进行非同源之间的通信。   

熟悉前端安全的同学，马上就能想到，若没有同源策略的限制，`CSRF`攻击则更容易进行。

来了看看`rfc`是怎么知道我们解决问题的吧

![](/blog_assets/websocket_rfc_origin_check.png)

其中蓝色部分已经支出，我们可以通过`信道建立`的`http`请求的`origin`字段进行校验，服务端可以直接拒绝掉非本站点发起的请求。 

### 默认的头字段们
* ##### request
  * `Sec-WebSocket-Key`: 是随机的字符串，用于后续校验。
  * `Origin`: 请求源
  * `Upgrade`: websocket
  * `Connection`: Upgrade

* ##### response
  * `Sec-WebSocket-Accept`: 用匹配寻找客户端连接的值，计算公式为`toBase64(sha1( Sec-WebSocket-Key + 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 ) )`
  这里的`258EAFA5-E914-47DA-95CA-C5AB0DC85B11` 为魔术字符串，为常量。  
  > 若计算不正确，或者没有返回该字段，则`websocket`连接不能建立成功


## 总结
`websocket`是基于`tcp`上的应用层协议，`http`遇到的问题`websocket`都会遇到，`鉴权`、`保活`、`签名`，这些在`http`都有现成基础可以操作，在`websocket`都需要使用者进行设计实现。

本文说完了`websocket`与后端部分传输信道的问题，下一篇则会着重讲讲如何实现一个简单的符合业务需求的`websocket`请求`lib`。


## 参考资料
[1] [深入理解跨站点 WebSocket 劫持漏洞的原理及防范](https://www.ibm.com/developerworks/cn/java/j-lo-websocket-cross-site/index.html)         
[2] [How to Use Websockets in Golang: Best Tools and Step-by-Step Guide](https://yalantis.com/blog/how-to-build-websockets-in-go)     
[3] [WebSocket 的鉴权授权方案 - Mo Ye](http://www.moye.me/2017/02/10/websocket-authentication-and-authorization/)
[4] [RFC - The WebSocket Protocol](https://tools.ietf.org/html/rfc6455)

## 请求库的封装
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

## websocket 与安全
http 101 upgrade 是那一部分进行处理的呢？
    - 程序框架还是 NGINX？
    - 101 请求是否会被 CSRF
    - 如何进行签名
    - 为何浏览器操作不了101请求（头字段添加）

## 是否有跨域限制？
* 浏览器怎么规定的呢？
* 没有跨域不会不安全吗？


<!-- 对端关闭，另一端是否能够立马知晓
突然中断呢？
   * 断电呢？
   * 手动退出呢？
   * 是否可以直接参考TCP四次挥手的几种情况。

心跳机制如何去做呢？ -->
























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
