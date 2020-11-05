## 前言
上一篇笔记了解了浏览器`同源策略`的方方面面，随着`web`服务的多元化，以及前后端分离的大环境，页面与资源的分离已经是必然的事情。这次则先聊聊工作中用得最多的 CORS 策略`(Corss-origin Resource Sharing)`。     

## CORS 与 请求类型
CORS 策略允许浏览器向跨源服务器发出获取资源，但请求既然是来源于不同于服务器的非同域。最容易出现以下问题: 
1. 跨域说明有可能是恶意站点发起，则处理请求前的 `同域检测` 就十分有必须要了。(你是否想起了`CSRF Token`的概念，后文会做相应比较)。     
2. 每次都携带全量数据访问服务端接口，但却因为最基础的 `同域检测` 都通过不了，则十分浪费网络带宽
3. 服务器执行 `同域检测` 的逻辑复杂程度不一，每一次都需要重新判断，也是对服务器资源的浪费   

针对此需求，w3c 在提出了一个`预检查请求` (CORS-preflight) 的概念。但由于`向下兼容`的需要，只在`非简单请求`中启用`预检查请求`，而对`简单请求`不作额外处理。    

服务端服务器可以根据这个`预检查请求`，来告知是否允许浏览器对原接口发起请求。
     
### 简单请求
正如前文👆所提到的，其实 `简单请求` 仅仅是为了 w3c 为了退出新策略而强行划定的标准。在 CORS 标准推出前，浏览器与服务器的数据交互大多数是使用 `<Form>` 发起的，那么为了最大程度地兼容已存在的服务，则以此为界定。

参考 👉[DOM Form - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form) 和  👉[简单请求 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS), 二者的描述 和 定义也十分相近。
![](/blog_assets/html_form_method.png)    

![](/blog_assets/simple_request_desc.png)

使用`form`标签是否可以发起这一标准，大多数情况下我们就不需要去强行记忆区分`简单请求`的那些复杂的`method`、`content-type` 和 `header`了。

### 非简单请求 与 预检查请求
很好理解的是, `非简单请求` 字面意思就是 除了 `简单请求` 以外的其他请求。这时候，浏览器会先行发送一个请求的`预检查请求`。     
![](/blog_assets/freflight-request.png)   

#### 预检测请求的有效时间
预检测请求存在的意义之一，则是减少服务器频繁执行 `检查同域` 逻辑，其起作用的核心则是： 
> Access-Control-Max-Age: xxx

在有效时间内，浏览器无须为同一请求再次发起预检请求。这一机制有效地减少了服务端执行 `同域检测` 逻辑的时间，节省了服务器的资源。   

如果值为 -1，则表示禁用缓存，每一次请求都需要提供预检请求，即用OPTIONS请求进行检测。

#### 其他的 CORS 头信息
`Access-Control-Allow-Origin`、`Access-Controll-Allow-Method`、`Access-Controll-Allow-Header` 和 `Access-Control-Allow-Credentials` 这几个的用法已经是老生常谈了。这里则不再赘述了。

![](/blog_assets/cors_header_cctip.png)


## 君子协定 CORS
与 HTTP 协议相类似，w3c 提出的 CORS 也是一种约定，需要浏览器和服务器共同配合实现。对于`预检测请求`的结果，仍然后很多种可能的处理流程: 
1. 浏览器在收到预请求结果为失败的情况下，仍去发起原`非简单请求`。
2. 对于`简单请求`，是否就可以绕过 `同源检测` 了呢？   
3. 同域策略 和 CORS 只在浏览器中存在约定，对于其他客户端，类似 `curl`、`postman`工具 和 其他脚本等发起的请求，是否不用检测了呢？    

#### OPTION检测 与 CSRF 预防相结合
在👉 [CSRF 实战](https://github.com/HXWfromDJTU/blog/issues/29) 笔记中，我们讲到过对于非同源请求的拦截与处理方法。结合起来 CORS 的 `OPTION` 预检查请求用于浏览器缓存`检测结果`，而`CSRF Token`的检测则用于做最后的防御。    

![](/blog_assets/option_csrf_combine.png)    

##### OPTION 处理 (Koa)
服务端的跨域处理，简单可以表示为以下的流程，感兴趣的话也可以看看[kosjs/cors](https://github.com/koajs/cors)插件的实现过程。     

```js
// 集中处理错误
const handler = async (ctx, next) => {
  // log request URL:
  ctx.set("Access-Control-Allow-Origin", "yourdmain.com");
  ctx.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  ctx.set("Access-Control-Max-Age", "86400");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with,Authorization,Content-Type,Accept");
  ctx.set("Access-Control-Allow-Credentials", "true");
  
  // 若有必要，请添加上其他 CSRF TOKEN 所需的响应头字段
  ctx.set("X-Yourdomain-Timestamp", "x-requested-with,Authorization,Content-Type,Accept");

  // 统一处理预请求
  if (ctx.request.method == "OPTIONS") {
    ctx.response.status = 204
  }

  console.log(`Process ${ctx.request.method} ${ctx.request.url}`);

  try {
    await next();
    console.log('handler通过')
  } catch (err) {
    console.log('handler处理错误')
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    };
  }
};
```


#### 小结
1. 客户端(浏览器)可以做的是判断请求目标源是否跨域，服务端可以做的是收到请求后，是否拒绝这一个请求，注意服务端判断的过程，消耗的资源可大可小。
2. 非简单请求可以触发 `preflight` 机制，使用 `Access-Control-Max-Age` 响应头实现预请求的缓存，减少服务器压力   
3. 作为网站开发者，尽量使用`非简单请求`，触发 `preflight` 机制而减小服务器压力。     
4. 预检查请求不能作为安全防护策略，仍然需要做好 `CSRF`防护。    

## 参考文章
[1] [跨源资源共享（CORS） - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)       
[2] [koa跨域 - mapplat](http://blog.mapplat.com/public/javascript/koa%E8%B7%A8%E5%9F%9F/)     
[3] [CORS 为什么要区分『简单请求』和『预检请求』？ - 奇舞团](https://juejin.im/post/6844903936512491528)     