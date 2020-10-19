网络上介绍的跨域的文章千千万，手法也是炫技式地列举了10好几种。但在这里，博主只想给大家介绍自己在项目中实际遇到的，和深入研究过的方案。每一种跨域方案的时候，都会给大家说明一下两点
* 该方案的使用场景
* 该方案容易踩到的坑

### 1️⃣ 标签资源"跨域"JSONP
在HTML规范中，有几个标签请求的资源是可以逃避同源策略的。 
* `<img>`标签是一个由来已久的标签，几乎没有任何的兼容性问题。实战中也常常用于打点计数。 
  ```js
  let image = new Image();
  image.onerror = image.onload = function(){
    console.log('跨域请求已经被服务器成功接收，但是我拿不到responseTest...😭');
  }
  image.src = 'www.taobao.com/api/v2?name=swainwong'
  ```
* `<script>`与`<linkl>`分别用于加载浏览器资源，也是常用的标签，常用于CDN请求  
* `<script>`标签还可以用与实现 JSONP跨域请求...下文继续讲述   

##### 实现原理
JSONP(JSONP with padding)相信`FEer`们在好多文章中都听过JSONP的大名，但是都没有实现过
1️⃣ 只能够使用get请求跨域获取资源
2️⃣ JSONP的原理是`script`标签不受同源策略的限制
##### 客户端操作
1️⃣ 客户端首先需要在全局环境中声明一个函数，用于接收和处理即将通过JSONP获取到的数据  
2️⃣ 然后使用Javscript动态生成一个`script`标签，类型为`text/javscript`,`src`值为`要跨域获取的资源地址`+`获取函数的字段名称`+`回调函数的名称`。例如：`www.assets.com/assets?callbackName=resovleFunction`，最后动态插入到head标签中
##### 客户端处理
```js
// callback处理函数  
function resolveJosn(result) {
	console.log(result.name);
}
// 原生
var jsonpScript= document.createElement("script");
jsonpScript.type = "text/javascript";
jsonpScript.src = "https://www.qiute.com?callback=resolveJson";
document.getElementsByTagName("head")[0].appendChild(jsonpScript);

// jQuery 
$.ajax({
    url: 'https://www.qiute.com',
    type: 'get',
    dataType: 'jsonp',  // 请求方式为jsonp
    jsonpCallback: "resolveJson",    // 自定义回调函数名
    data: {}
});
```

##### 服务端处理
1️⃣ 服务端接收到请求之后，从取出请求的URL中取出方法的名称
2️⃣ 使用这个方法的名称，动态生成一段Javascript代码，在代码中使用这个方法，将所需要传输的跨域数据，作为函数的参数传入处理方法中
```js
// nodejs服务端 
server.on('request', function(req, res) {
    var params = qs.parse(req.url.split('?')[1]);
    var fn = params.callback;
    // jsonp返回设置
    res.writeHead(200, { 'Content-Type': 'text/javascript'});
    res.write(fn + '(' + JSON.stringify(params) + ')');
    res.end();
});
```
##### 实现效果
3️⃣ 服务端返回这一段`script`之后，浏览器端获取到了资源，根据浏览器的加载策略，会立即执行这段代码。达到跨域获取数据的效果。

##### 注意事项
1️⃣ JSONP是从其他域中加载代码执行，如果域名不安全，很可能会在响应中夹带一些恶意代码。   
2️⃣ 我们无法得知JSONP请求的成功与否。   



### 3️⃣ 使用 postMessage 进行跨域
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

### 4️⃣ nginx
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

### 5️⃣ node
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

### 6️⃣ websocket 
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

### 7️⃣ document.domain   
![](/blog_assets/CO_domain.png)  
⭕️ 注意只能够在主域相同的情况下，进行跨子域访问  
① 将两个域的`document.domain`都设置为相同的`baidu.com`。（假设两个页面为`aaa.baidu.com`和`bbb.baidu.com`）      
② 通过两个页面的句柄(窗口对象)去访问内部的变量。   

### 8️⃣ window.name + iframe  
注意，跨域的页面只有初始化同步设置了`window.name`属性才能够获取到该数据。
```js
iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    var state = 0;
    
    iframe.onload = function() {
      if(state === 1) {
          var data =iframe.contentWindow.name;
          console.log(data);
          iframe.contentWindow.document.write('');
          iframe.contentWindow.close();
        document.body.removeChild(iframe);
      } else if(state === 0) {
          state = 1;
          iframe.contentWindow.location = 'https://red.jd.com/redList-297580-26.html';
      }
    };
    iframe.src = 'https://map.baidu.com';
    document.body.appendChild(iframe);
```
### 9️⃣ location.hash (待完善)

<!-- ### summary
> 接下来准备去了解剩下的跨域方法，在项目中具体有哪些跨域需求，又有哪些操作需要FEer们去进行操作的 :smile: [传送门](/browser/CORS_ON_WORK.md) -->
___
### 参考文章
[CORS - qiutc.me](https://qiutc.me/post/cross-domain-collections.html)       
[CORS - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)   
[CORB是什么鬼](https://blog.csdn.net/weixin_42672054/article/details/81985736)  
[前端跨域大全 -by 360前端](https://segmentfault.com/a/1190000016653873)  
[前端常见跨域 - 掘金](https://juejin.im/entry/59b8fb276fb9a00a42474a6f)

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
##### 跨域的方式一共有多种

| 序号| 常用方法 | 主要原理 | 优缺点 |
| ------ | ------ | ------ | ------ | 
| 1️⃣ | `JSONP`  | 使用服务端返回字符串立即执行全局函数来传递参数 | 只能够使用get请求 |  |
| 2️⃣ |  `CORS`  |  HTTP协议的`Allow-Control-Allow-Origin`等字段，与服务端达成协议|  |
| 3️⃣| `postMessage`  | 利用窗口的句柄的postMessage进行跨域 |  |  |
| 4️⃣ | `nginx`  | 代理服务器不存在跨域问题 |  |  |  
| 5️⃣ | `nodejs`  | 代理服务器不存在跨域问题 |  |  |  
| 6️⃣ | `websocket`  | websocket协议原本就允许跨域 |  |  |  

| 序号| 不常用的Hack | 主要原理 | 优缺点 |
| ------ | ------ | ------ | ------ | 
| 7️⃣ |  `domain` |通过JS进行document.domin将iframe和主页面设置为同一个domian实现跨子域 | 只能够跨子域 ,只能够在同个iframe内 |  |  |
| 8️⃣ | `window.name`  | 通过在窗口中动态创建一个`iframe`先指向请求资源域，再指向本地发送域，会产生两次`onload`事件，第二次加载时候，通过window.name的callback传递给本地页面 |  |  |
| 9️⃣ | `hash`  |  |  |  |

## 参考资料