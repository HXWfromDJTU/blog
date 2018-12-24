# CORS实战
>上一篇笔记了解了什么是跨域，和跨域的原理。
本文，有两个目的。
* ① 主要了解垮在工作中的需求，我们为什么要去跨域。
* ② 如何使用这种手段和工具去进行跨域。(重点)
## 我们为什么要去跨域
> Q：为什么有跨域需求?
>A：场景 —— 工程服务化后，不同职责的服务分散在不同的工程中，往往这些工程的域名是不同的，但一个需求可能需要对应到多个服务，这时便需要调用不同服务的接口，因此会出现跨域。
___
## 使用JSONP进行跨域
* 上一篇文章有讲到过，`JSONP`有兼容性好的有点，几乎可以兼容所有市面上的低版本IE
* 缺点是，`JSONP`只支持`GET`请求，而且需要前后端的一齐配合，比较麻烦(你知道后端的啦...麻烦别人总是不好的)

___
## 使用 postMessage 进行跨域
[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

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
接收时候，事件源对象`e`中可以获取三个重要的元素
* data 表示父页面发过来的数据
* source 表示发送消息的窗口对象
* origin 表示发送消息的窗口的 (协议 +  主机号 + 端口 )


___
## 使用各种代理服务器实现跨域
* 因为浏览器之外，使用服务器发起请求并没有同源策略的约束。

### 使用node做代理服务器
步骤
* 代理服务器(中间层)接受客户端的服务请求
* 将 浏览器 的请求转发给真正的服务端
* 服务端返回所要请求的数据
* 将服务端返回的数据转发给客户端

#### 浏览器脚本
```js
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
#### 服务器脚本
```js
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
#### 服务端代码
* 