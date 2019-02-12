# 工作中的CORS
![](/blog_assets/cors_work_cover.png)
>上一篇笔记了解了什么是跨域，和跨域的原理。

本文，有两个目的。
1️⃣ 主要了解垮在工作中的需求，我们为什么要去跨域。
2️⃣ 如何使用这种手段和工具去进行跨域。(重点)

#### 为什么有跨域需求?
场景 —— 工程服务化后，不同职责的服务分散在不同的工程中，往往这些工程的域名是不同的，但一个需求可能需要对应到多个服务，这时便需要调用不同服务的接口，因此会出现跨域。
___

### 6️⃣ 使用 postMessage 进行跨域
[MDN文档] (https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)
##### 举个iframe的例子
父页面发送消息：
```js 
window.frames[0].postMessage('message', origin)
```
iframe子页面接收消息：
```js
window.addEventListener('message',function(e){
    if(e.source!=window.parent) return;//若消息源不是父页面则退出
      //TODO ...
});
```
##### 另一个页面的例子
![](/blog_assets/CO_postMessage.png)  


接收时候，事件源对象`e`中可以获取三个重要的元素  
1️⃣ data 表示父页面发过来的数据
2️⃣ source 表示发送消息的窗口对象   
3️⃣ origin 表示发送消息的窗口的 (协议 +  主机号 + 端口 )


___
### 使用各种代理服务器实现跨域
☯️ 因为浏览器之外，使用服务器发起请求并没有同源策略的约束。
☯️ 当然你的代理服务器，是要和当前页面要部署在一个域上...

### 7️⃣ nginx
我们可以在`nginx`层为每个请求都添加上跨域的配置  

```conf
# 匹配目标站点的域名
server {
  listen 81;
  server_name localhost # 表示前端页面所载的服务器
  location /{ # 表示拦截所有请求
      proxy_pass http://www.server.com:8080 # 反向代理到真实的服务器上  
      proxy_cookie_domin localhost www.server.com  # 传递cookie到目标服务器 

      ### 添加头部跨域信息 start ####
      add_header Access-Control-Allow-Origin *;
      add_header Access-Control-Allow-Headers X-Requested-With;
      add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
      ###end ###
  }
}
```

### 8️⃣ node
1️⃣ 代理服务器(中间层)接受客户端的服务请求
2️⃣ 将 浏览器 的请求转发给真正的服务端
3️⃣ 服务端返回所要请求的数据
4️⃣ 将服务端返回的数据转发给客户端

```js
//浏览器脚本
import axios from 'axios';
axios.get('http://localhost:9527',{
  params:{
    data:'i am trying to make a CORS request'
  }
}).then(data=>{
   console.log(data)
}).catch(error=>{
   console.log('there was sth wrong....'+err)
})
```

```js
//服务器脚本
const http = require('http'); //引入http模块
// 创建代理服务器
const server = http.createServer((request,reponse)=>{
          // 首先设置跨域返回报文头，不包含跨域所需要的 CORS的首部字段
            response.writeHeade(200,{
               'Access-Control-Allow-Origin': '*',  // 设置 optins 方法允许所有服务器访问 
               'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
           });
         // 第二步：将请求转发给服务器
        const proxyRequest = http.request({
          host:'127.0.0.1',
          port:4000,
          url:'/',
          method:request.method,// 使用客户端请求相同的请求方式
          header:request.header   // 使用与客户端请求相同的header信息
        },(serverResponse)=>{
          // 第三步，收到服务器返回的信息
            let body = '';
            serverResponse.on('data',(crumb)=>{
              body +=crumb;
            });
            serverResponse.on('end',()=>{
              console.log(data);
              response.end(body) // 注意此处的response 是用于处理客户端请求的response对象
            });
        }).end(); //向服务端请求数据完成
})
// 启动代理服务器的监听
server.listen(9527,()=>{
     console.log('the server is running at http://localhost:9527');
},)
```

### 9️⃣ websocket 
`WebSocket protocol` 是`HTML5`一种新的协议。它实现了浏览器与服务器全双工通信，同时允许跨域通讯，是`server push`技术的一种很棒的实现。  

##### 客户端代码 
```js
// 客户端使用原始的 websocket规范进行编写
let ws = new WebSocket('ws://192.30.47.91:8080/url');
ws.open = function(){
  console.log('websocket has connected');
}

ws.onclose = function(){
  console.log('client socket has closed')
}

ws.onmessage = function(data){
    console.log(data);
}

ws.send('some data'); 

// 关闭连接
ws.close();
```

##### 服务端代码(192.30.47.91:8080)
```js
// 本例子中直接使用websocket的流行包socket.io进行演示
let io = require('socket.io');
let http = require('http');

// 启动http服务
let server = http.createServer((req,res)=>{
  res.writeHead(200,{'Content-type','text-/html'});
}).listen(9527);

// 使用
io.listen(server).on('connection',port=>{
  // 
  port.on('message',msg=>{
    console.log('Message from Client:',msg);  // 打印客户端信息
    client.send('Here is a message from server');// 给客户端发一条
  })
  port.on('disconnect',data=>{
    console.log('Server was out...'); // 服务端断开连接了
  })
})

```
