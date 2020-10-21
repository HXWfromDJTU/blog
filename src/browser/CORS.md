上一篇笔记了解了浏览器`同源策略`的方方面面，随着`web`服务的多元化，以及前后端分离的大环境，页面与资源的分离已经是必然的事情。

这次则来介绍下，工作中遇到`跨域`问题是如何解决的吧。

## CORS
`W3C` 有一个CROS策略`(Corss-origin Resource Sharing)`，允许浏览器向跨源服务器，发出异步请求`(XHRHttpRequest)`，获取所需要的资源。  

![CORS兼容性](/blog_assets/section-cross-domain-cors.png)
* 所有的跨域行为，都需要资源提供方的改动与许可。   
* 支持`CORS`的浏览器会在发生跨域请求时，携带上对应的请求头。
* 网页应用开发者并不需要做额外的预处理，处理的工作在于服务端返回的响应头中，是否包含了预期的内容，允许了本次的跨域请求。

### 简单请求
若是简单请求必须满足以下三点特征：  
* 请求方法必须是`GET`、`POST`、`HEAD`
* HTTP的头信息不超出以下几种字段：`Accept`  `Accept-Language`  `Content-Language` `Last-Event-ID`  
* `Content-Type`：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`  

请求发送时，浏览器会在`header`中添加`Origin`这一个字段,表示本次请求的来源是哪里。内容包括( 协议+域名+端口号 )

![cross_origin_header.png](/blog_assets/CORS_request_header.png) 

### 复杂请求
若是复杂型的跨域请求，客户端回先发一个`正常的(非跨域)HTTP请求`，就进行预告知,主要内容包括以下几点：

* `Origin` 
表示正式请求中，会去请求资源的地址。

* `Access-Control-Request-Method`
该字段是必须的，用来列出浏览器的`CORS`请求会用到哪些HTTP方法   

* `Access-Control-Request-Headers`    
该字段表明，在即将发送的正式跨域请求中，需要浏览器除了基本字段外，额外发送什么这段，内容是一个逗号分隔的字符串

    ```js
    OPTIONS /cors HTTP/1.1
    Origin: https://api.qiutc.me
    Access-Control-Request-Method: PUT
    Access-Control-Request-Headers: X-Custom-Header
    Host: api.qiutc.com
    Accept-Language: en-US
    Connection: keep-alive
    User-Agent: Mozilla/5.0...
    ```
##### 预请求的返回
* `Access-Control-Max-Age`
可选字段，用来指定本次预检请求的有效期，单位为秒。在此安全时间范围内，不需要另外发送预请求。
##### 正式的跨域请求
* 在与请求成功之后，有效限期之内。客户端和服务端就可以直接进行跨域请求，不需要另外发送预请求。
* 并且每次的跨域请求中，请求报文会包含`Origin`字段，服务器的返回报文会包含`Access-Control-Allow-Origin`

### 服务端的处理
若浏览器发现本次请求为跨域请求，则会在返回的响应报文中多添加几个字段
![](/blog_assets/CORS_response_header.png)
* `Access-Control-Allow-Origin`  
   必要字段。表示服务端允许那些地址的资源可以进行跨域访问。一般值为请求头中相同的资源地址值，或者是`*` 
* `Access-Control-Allow-Credentials`
   可选字段，意为是否允许客户端发送跨域请求时，带上浏览器的`cookie`数据，默认值为false。
   除此之外
   ☎️ 要客户端会将cookie数据传到服务端，在启动异步请求的时候，需要设置
   ```js
   var xhr = new XMLHttpRequest(); 
   xhr.withCredentials = true;
   ```
   ☎️ 若要使用cookie跨域，服务端相应头中，`Access-Control-Allow-Origin`就不能模糊地表为` * `，而是需要标明与发送请求客户的地址。   
   
* `Access-Control-Expose-Headers`
   可选字段，用于给返回报文中，添加六个基本字段外的其他字段。客户端在获得返回报文的时候，可以使用`XHR.getResponseHeader()`获取到包括基础字段，外加这些额外的字段 

#### ⭕️ 拒绝跨域请求
* 若是服务端选择拒绝这个跨域请求，则在返回报文中不设置`Access-Control-Allow-Origin`字段即可   
* 浏览器解析报文时，发现没有该字段，则会抛出一个错误，会被`XHRHttpRequest`对象的`onerror`获取到，从而客户端就可以捕获并处理该错误  



## 简单请求与复杂请求 与 安全
* 项目中使用了签名安全方案的请求头
* 项目中使用了业务信息的请求头(本不应该携带在此)
