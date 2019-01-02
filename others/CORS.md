# 聊聊前端的跨域

### 远古的认知
>To be honest，第一回接触跨域是在实习的时候，前后端准备联调。需要我们访问后端同事机器上的服务资源，呆头呆脑的我再浏览器上发送了好久的HXR 请求，却一直不成功.....笨死了啦.....组长让我在Chrome的启动程序上，加上`--disable-web-security`的小尾巴，then ,it works....

挺长一段时间，对跨域的理解就停留在这个层面...也知道浏览器有个同源策略，为了尽量保证页面的安全，默认不允许加载不同源的资源。
后来知道这个方法算是`hack跨域`的一种手段

### CORS
在后来的学习中，发现W3C还有一个CROS策略(Corss-origin- resource sharing)，策略允许李兰器向跨源服务器，发出异步请求(XHRHttpRequest)，获取所需要的资源。 

### 兼容性
![CORS兼容性](blog_assets/section-cross-domain-cors.png)
* 跨域需要服务器端和客户端都支持
* 前端来说，主要是突破浏览器的同源策略即可，使用跨域时，与往常使用ajax请求一样，并不需要做额外的预处理

### 简单型请求

#### 请求的检测
* 若是简单请求必须满足一下几点特征：
 ①：请求方法必须是`GET`、`POST`、`HEAD`
 ② HTTP的头信息不超出以下几种字段：
 * `Accept`
 * `Accept-Language`
 * `Content-Language`
 * `Last-Event-ID`
 * `Content-Type`：只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`
#### 包装过程
* 请求发送时，浏览器会在header中添加`Origin`这一个字段,表示本次请求的来源是哪里。内容包括( 协议+域名+端口号 )
![cross_origin_header.png](blog_assets/cross_origin_header.png)

#### 服务端的处理
#### ①允许跨域请求
   * 若浏览器多出本次跨域请求，则会在返回的响应报文中多添加几个字段
   ```js
   // Response Header
Access-Control-Allow-Origin: https://api.qiutc.me    // 
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: Info
Content-Type: text/html; charset=utf-8
   ```
   * `Access-Control-Allow-Origin` 
   必要字段。表示服务端允许那些地址的资源可以进行跨域访问。一般值为请求头中相同的资源地址值，或者是`*`
   * `Access-Control-Allow-Credentials`
   可选字段，意为是否允许客户端发送跨域请求时，带上浏览器的`cookie`数据，默认值为false。
   除此之外
   ①：要客户端会将cookie数据传到服务端，在启动异步请求的时候，需要设置
   ```js
   var xhr = new XMLHttpRequest(); 
   xhr.withCredentials = true;
   ```
   ② ：服务端相应头中，`Access-Control-Allow-Origin`就不能模糊地表为` * `，而是需要标明与发送请求客户的地址。
   * `Access-Control-Expose-Headers`
   可选字段，用于给返回报文中，添加六个基本字段外的其他字段。客户端在获得返回报文的时候，可以使用`XHR.getResponseHeader()`获取到包括基础字段，外加这些额外的字段
#### ②拒绝跨域请求
* 若是服务端选择拒绝这个跨域请求，则在返回报文中不设置`Access-Control-Allow-Origin`字段即可
* 浏览器解析报文时，发现没有该字段，则会抛出一个错误，会被`XHRHttpRequest`对象的`onerror`获取到，从而客户端就可以捕获并处理该错误
### 复杂型的请求
#### 请求的检测(预请求)
* 若是复杂型的跨域请求，客户端回先发一个正常的(非跨域)HTTP请求，就进行预告知，主要内容包括以下几点：
   ① `Origin`
     表示正式请求中，会去请求资源的地址。
   ② `Access-Control-Request-Method`
     该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是PUT。
    ③ `Access-Control-Request-Headers` 
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
#### 预请求的返回
   * ` Access-Control-Allow-Methods`
必需字段，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次”预检”请求。
* `Access-Control-Allow-Headers`
如果浏览器请求包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在”预检”中请求的字段。
* `Access-Control-Max-Age`
可选字段，用来指定本次预检请求的有效期，单位为秒。在此安全时间范围内，不需要另外发送预请求。
#### 正式的跨域请求
* 在与请求成功之后，有效限期之内。客户端和服务端就可以直接进行跨域请求，不需要另外发送预请求。
* 并且每次的跨域请求中，请求报文会包含`Origin`字段，服务器的返回报文会包含`Access-Control-Allow-Origin`

### JSONP方式实现跨域
#### 实现原理
* 只能够使用get请求跨域获取资源
* JSONP的原理是`script`标签不受同源策略的限制
#### 客户端操作
* 客户端首先需要在全局环境中声明一个函数，用于接收和处理即将通过JSONP获取到的数据
* 然后使用Javscript动态生成一个`script`标签，类型为`text/javscript`,`src`值为`要跨域获取的资源地址`+`获取函数的字段名称`+`回调函数的名称`。例如：www.assets.com/assets?callbackName=resovleFunction，最后动态插入到head标签中
```js
function resolveJosn(result) {
	console.log(result.name);
}
var jsonpScript= document.createElement("script");
jsonpScript.type = "text/javascript";
jsonpScript.src = "https://www.qiute.com?callbackName=resolveJson";
document.getElementsByTagName("head")[0].appendChild(jsonpScript);
```

#### 服务端处理
* 服务端接收到请求之后，从取出请求的URL中取出方法的名称
* 使用这个方法的名称，动态生成一段Javascript代码，在代码中使用这个方法，将所需要传输的跨域数据，作为函数的参数传入处理方法中
```js
resolveFunction({name: 'qiutc'});
```
#### 实现效果
* 服务端返回这一段`script`之后，浏览器端获取到了资源，根据浏览器的加载策略，会立即执行这段代码。达到跨域获取数据的效果。

[参考文章](https://qiutc.me/post/cross-domain-collections.html)

> 接下来准备去了解一哈，在项目中具体有哪些跨域需求，又有哪些操作需要FEer们去进行操作的 :smile:


