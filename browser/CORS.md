# 聊聊前端跨域
![](/blog_assets/CORS_cover.png)
### 远古的认知
>To be honest，第一回接触跨域是在实习的时候，前后端准备联调。需要我们访问后端同事机器上的服务资源，呆头呆脑的我再浏览器上发送了好久的HXR 请求，却一直不成功.....笨死了啦.....组长让我在Chrome的启动程序上，加上`--disable-web-security`的小尾巴，then ,it works....
挺长一段时间，对跨域的理解就停留在这个层面..
后来知道这个方法只算是`hack跨域`的一种手段。


其实这是浏览器的同源策略，为了尽量保证页面的安全，默认不允许加载不同源的资源。 




> 当`协议`、`子域名`、`主域名`、`端口号`中任意一个不相同时，都算作不同源。   

##### 同源策略限制内容有       
1️⃣ Cookie、LocalStorage、IndexedDB 等存储性内容    
2️⃣ DOM 节点     
3️⃣ AJAX 请求不能发送     


##### 跨域的方式一共有多种

| 序号| 跨域方法 | 主要原理 | 优缺点 | 写法 |
| ------ | ------ | ------ | ------ | ------ |
| 1️⃣ | `JSONP`   | 使用服务端返回字符串立即执行全局函数来传递参数 | 只能够使用get请求 |  |
| 2️⃣ | `iframe + domain`  | 通过JS进行document.domin将iframe和主页面设置为同一个domian实现跨子域 | 只能够跨子域 ,只能够在同个iframe内 |  |
| 3️⃣ | `iframe + hash`  |  |  |  |
| 4️⃣ | `iframe + window.name`  |  |  |  |
| 5️⃣ | `CORS`  |  |  |  |
| 6️⃣| `postMessage`  |  |  |  |
| 7️⃣ | `nginx`  |  |  |  |  
| 8️⃣ | `nodejs`  |  |  |  |  
| 9️⃣ | `websocket`  |  |  |  |  



___  
### 1️⃣ CORS
 
W3C还有一个CROS策略`(Corss-origin Resource Sharing)`，策略允许浏览器向跨源服务器，发出异步请求`(XHRHttpRequest)`，获取所需要的资源。   
#### CORS 的兼容性
![CORS兼容性](/blog_assets/section-cross-domain-cors.png)
1️⃣ 所有的跨域行为，都需要资源提供方的改动与许可。   

2️⃣ 前端来说，主要是突破浏览器的同源策略即可，使用跨域时，与往常使用ajax请求一样，并不需要做额外的预处理  
#### 直接请求资源型CORS
##### 客户端请求
若是简单请求必须满足一下几点特征：  
 1️⃣ 请求方法必须是`GET`、`POST`、`HEAD`
 2️⃣ HTTP的头信息不超出以下几种字段：`Accept`  `Accept-Language`  `Content-Language` `Last-Event-ID`  
 3️⃣ `Content-Type`：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`  
4️⃣ 请求发送时，浏览器会在`header`中添加`Origin`这一个字段,表示本次请求的来源是哪里。内容包括( 协议+域名+端口号 )
![cross_origin_header.png](/blog_assets/CORS_request_header.png)

##### 服务端的处理
 若浏览器多出本次跨域请求，则会在返回的响应报文中多添加几个字段
![](/blog_assets/CORS_response_header.png)
##### 1️⃣ `Access-Control-Allow-Origin`  
   必要字段。表示服务端允许那些地址的资源可以进行跨域访问。一般值为请求头中相同的资源地址值，或者是`*` 
##### 2️⃣ `Access-Control-Allow-Credentials`
   可选字段，意为是否允许客户端发送跨域请求时，带上浏览器的`cookie`数据，默认值为false。
   除此之外
   ☎️ 要客户端会将cookie数据传到服务端，在启动异步请求的时候，需要设置
   ```js
   var xhr = new XMLHttpRequest(); 
   xhr.withCredentials = true;
   ```
   ☎️ 若要使用cookie跨域，服务端相应头中，`Access-Control-Allow-Origin`就不能模糊地表为` * `，而是需要标明与发送请求客户的地址。
##### 3️⃣ `Access-Control-Expose-Headers`
   可选字段，用于给返回报文中，添加六个基本字段外的其他字段。客户端在获得返回报文的时候，可以使用`XHR.getResponseHeader()`获取到包括基础字段，外加这些额外的字段 

##### ⭕️ 拒绝跨域请求
1️⃣ 若是服务端选择拒绝这个跨域请求，则在返回报文中不设置`Access-Control-Allow-Origin`字段即可   
2️⃣ 浏览器解析报文时，发现没有该字段，则会抛出一个错误，会被`XHRHttpRequest`对象的`onerror`获取到，从而客户端就可以捕获并处理该错误   

#### 预先请求机制型CORS
##### 预请求
若是复杂型的跨域请求，客户端回先发一个`正常的(非跨域)HTTP请求`，就进行预告知,主要内容包括以下几点：

##### 1️⃣`Origin` 
表示正式请求中，会去请求资源的地址。

##### 2️⃣ `Access-Control-Request-Method`
该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法   
##### 3️⃣ `Access-Control-Request-Headers`    
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
1️⃣ ` Access-Control-Allow-Methods`
必需字段，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次”预检”请求。
2️⃣ `Access-Control-Allow-Headers`
如果浏览器请求包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在”预检”中请求的字段。
3️⃣`Access-Control-Max-Age`
可选字段，用来指定本次预检请求的有效期，单位为秒。在此安全时间范围内，不需要另外发送预请求。
##### 正式的跨域请求
4️⃣ 在与请求成功之后，有效限期之内。客户端和服务端就可以直接进行跨域请求，不需要另外发送预请求。
5️⃣ 并且每次的跨域请求中，请求报文会包含`Origin`字段，服务器的返回报文会包含`Access-Control-Allow-Origin`
___

### 2️⃣ 标签资源"跨域"JSONP
在HTML规范中，有几个标签请求的资源是可以逃避同源策略的。 
1️⃣ `<img>`标签是一个由来已久的标签，几乎没有任何的兼容性问题。实战中也常常用于打点计数。 
```js
let image = new Image();
image.onerror = image.onload = function(){
   console.log('跨域请求已经被服务器成功接收，但是我拿不到responseTest...😭');
}
image.src = 'www.taobao.com/api/v2?name=swainwong'
```
2️⃣ `<script>`与`<linkl>`分别用于加载浏览器资源，也是常用的标签，常用于CDN请求  
3️⃣ `<script>`标签还可以用与实现 JSONP跨域请求...下文继续讲述 

##### JSONP
JSONP(JSONP with padding)相信FNer们在好多文章中都听过JSONP的大名，但是都没有实现过
##### 实现原理
1️⃣ 只能够使用get请求跨域获取资源
2️⃣ JSONP的原理是`script`标签不受同源策略的限制
##### 客户端操作
1️⃣ 客户端首先需要在全局环境中声明一个函数，用于接收和处理即将通过JSONP获取到的数据  
2️⃣ 然后使用Javscript动态生成一个`script`标签，类型为`text/javscript`,`src`值为`要跨域获取的资源地址`+`获取函数的字段名称`+`回调函数的名称`。例如：`www.assets.com/assets?callbackName=resovleFunction`，最后动态插入到head标签中
```js
function resolveJosn(result) {
	console.log(result.name);
}
var jsonpScript= document.createElement("script");
jsonpScript.type = "text/javascript";
jsonpScript.src = "https://www.qiute.com?callback=resolveJson";
document.getElementsByTagName("head")[0].appendChild(jsonpScript);
```

##### 服务端处理
1️⃣ 服务端接收到请求之后，从取出请求的URL中取出方法的名称
2️⃣ 使用这个方法的名称，动态生成一段Javascript代码，在代码中使用这个方法，将所需要传输的跨域数据，作为函数的参数传入处理方法中
```js
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

> 接下来准备去了解一哈，在项目中具体有哪些跨域需求，又有哪些操作需要FEer们去进行操作的 :smile: [传送门](/browser/CORS_ON_WORK.md)

___
### 参考文章
[CORS - qiutc.me](https://qiutc.me/post/cross-domain-collections.html)       
[CORS - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)   
[CORB是什么鬼](https://blog.csdn.net/weixin_42672054/article/details/81985736)  
[前端跨域大全 -by 360前端](https://segmentfault.com/a/1190000016653873)




