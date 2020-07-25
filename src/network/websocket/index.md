# websocket 项目实战 - 连接、鉴权、心跳与数据安全

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

### 跨站点 WebSocket 劫持

#### 信道建立依赖于http
若是项目验证身份的token是保存在cookie中的，并且我们知道`websocket`的信道建立是要通过`http`协议的`upgrade`完成的，那么也就存在浏览器中的`CSRF`问题。

#### 不存在跨域
>  跨域资源共享不适应于 WebSocket，WebSocket 没有明确规定跨域处理的方法。

也就是说在浏览器层面，不需要跨域访问的资源的服务器返回`Access-Control-Allow-Origin`的`Response Header`，数据仍然能够正常返回并且解析。


### 原本~~打算~~的方案
针对普通的CSRF问题，先前的做法是在接口的`HTTP`请求头中，添加自定义的请求签名自定义头字段。这样做可以基本做到发起请求的页面，是出自我们自己的业务代码，而其他伪造请求的代码，会因为得不到签名字段而被后端拦截掉。

#### 不支持修改的请求头
相同的，也想在websocket `信道建立`的请求中照葫芦画瓢。

但实践中发现，不同于`http`请求，`websocket`请求的`http Connect-upgrade`请求是浏览器内部发出的，市面上常见的浏览器都不支持我们对请求头进行编写、拓展、删除。

所以这个方法行不通。

### 可行的方案
#### 官方建议的方案 - check origin
来了看看`rfc`是如何建议我们解决问题的吧

![](/blog_assets/websocket_rfc_origin_check.png)

其中蓝色部分已经支出，我们可以通过`信道建立`的`http`请求的`origin`字段进行校验，服务端可以直接拒绝掉非本站点发起的请求。

#### 补充的方案 - token
这次的项目虽然只是web,但我们进一步司考，若发起请求(重放请求)的攻击方环境并不是浏览器呢？是客户端，甚至是脚本拦截请求后的重放呢？

这时候，我们就需要给信道建立的http请求加上更加严格的束缚 - 一次性过期的Token。

可行的实际过程可以是:
* 服务端先通过http请求下发一个Token给客户端，可以是放到cookie中，但必须是一个一次性的Token。
* 客户端使用这个token来建立信道，建立成功后之后，Token也就随即废弃。
* 即使遇到了重放、CSRF劫持，也无需害怕不明的恶意攻击者能够连接上你的webscoket服务了。


## 补充
这里补充说一下`websocket`请求头中的一些字段，算是项目安全决策的一些辅助知识。


>  默认的头字段们
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
