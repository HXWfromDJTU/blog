# http状态码 及其 对应报文头

### 1XX 
#### 100 Continue
##### `行为表现`
HTTP/1.1 协议里设计 100 (Continue) HTTP 状态码的的目的是，在客户端发送 Request Message 之前，HTTP/1.1 协议允许客户端先判定服务器是否愿意接受客户端发来的消息主体（基于 Request Headers）。      

##### `设计含义`
即， Client 和 Server 在 Post （较大）数据之前，允许双方“握手”，如果匹配上了，Client 才开始发送（较大）数据。
这么做的原因是，如果客户端直接发送请求数据，但是服务器又将该请求拒绝的话，这种行为将带来很大的资源开销。    

##### `操作`
如果 client 预期等待“100-continue”的应答，那么它发的请求必须包含一个 " Expect: 100-continue"  的头域！  

客户端 Request Header
![](/blog_assets/101_2.png)    

服务端处理
![](/blog_assets/100.png)  
#### 101 Switching Protocols
表示访问当前资源需要更换协议进行数据传输

![](/blog_assets/101.png)
___
### 2XX 
一类的状态码，表示你的请求已经被服务器正确地处理了，没有遇到其他问题，服务器在返回体中，选择性地返回一些内容\

#### 200 OK
* 请求被服务器成功处理，服务器会根据不同的请求方式返回结果 

#### 201 Created  
请求已经被实现，而且有一个新的资源已经依据请求的需要而建立，且其 URI 已经随Location 头信息返回。
![](/blog_assets/201.png)  


#### 204 NO CONTENT
❤️ 服务器已经完成了处理，但是不需要返回响应体   
![](/blog_assets/204.png)
##### `RFC的描述原文` 
<code>If the client is a user agent, it SHOULD NOT change its document view from that which caused the request to be sent. This response is primarily intended to allow input for actions to take place without causing a change to the user agent’s active document view, although any new or updated metainformation SHOULD be applied to the document currently in the user agent’s active view.</code>
若用户进行
#### 206 PARTIAL CONTENT
* 这个状态码的出现，表示客户端发起了`范围请求`，而服务器只对其中的一部分的请求成功处理了
* 此时的客户端请求，必须包含有`range`字段，而服务端的报文中，必须包含由，`Content-Range`指定的实体内容(`entity`) 

![](/blog_assets/206.png)
### 3XX 
表示服务器端已经接受到了请求，必须对请求进行一些特殊的处理之后，才能够顺利完成此处请求
#### 301 MOVE PERMANELTLY
请求的资源已经被永久地重定向了，301状态码的出现表示请求的URL对应的资源已经被分配了新的定位符。
💎 HEAD请求下，必须在头部`Location`字段中明确指出新的URI  
💎 除了有`Location`字段以外，还需要在相应体中，附上永久性的URI的链接文本  
💎 若是客户使用`POST`请求的话，服务端若是使用重定向，则需要经过客户的同意    
💎 对于`301`来说,资源除非额外指定，否则默认都是可缓存的。     

![](/blog_assets/301.png)  

⭕️ 实际场景：我们使用http访问一些只接受https资源的时候，浏览器设置了自动重定向到https，那么首次访问就会返回`301`的状态码。   

#### 302 FOUND  
💎 与`301`状态码意思几乎一样，不同点在于`302`是临时的重定向，但只对本次的请求进行重定向     
💎 若用户将本URI收藏了起来，不去修改书签中的指向。    
💎 重定向的时候，RFC规范规定，不会去改变请求的方式。但实际上，很多现存的浏览器都直接将302响应视为303响应，并且在重定向的时候，使用`GET`方式返回报文中`Location`字段指明的`URL`     
💎 对于资源缓存，只有在`Cache-Control`或`Expires`中进行了指定的情况下，这个响应才是可缓存的。   

![](/blog_assets/302.png)   

⭕️ 实际场景：我们使用的网站短地址，访问的时候就会临时重定向到我们压缩前地址指向的页面。    

#### 303 SEE OTHER `(http 1.1)`
💎 表明用户请求的资源，还存在另一个对应的URI，其实也是重定向的含义  
💎 大多数浏览器会将`303`状态码同样处理为`302`，而且是直接将非`GET`、`HEAD`请求改为`GET`请求。     
💎 重定向的时候，统一使用GET形式去进行   

![](/blog_assets/303.png)  


#### 307 Temporary Redirect `(http1.1)`
💎 HTTP1.1文档中307状态码则相当于HTTP1.0文档中的302状态码      
💎 当客户端的POST请求收到服务端307状态码响应时，需要跟用户询问是否应该在新URI上发起POST方法，也就是说，307是不会把POST转为GET的。   
💎 也就是说 307的处理，应该完全遵守http1.0时代对302处理。  

![](/blog_assets/307.png)   



#### 总结 3XX   
1️⃣ http1.0和http 1.1都规定，若客户端发送的是非GET或者HEAD请求，响应头中携带301或302的时候，浏览器不会自动进行重定向，而需要询问用户，因为此时请求的情况已经发生变化。
![](/blog_assets/301_REPOST.png)
<div style="text-align:center;color:grey;">http 1.1 301说明</div>

![](/blog_assets/302_REPOST.png) 
<div style="text-align:center;color:grey;">http 1.0 302说明</div> 

![](/blog_assets/302_REPOST2.png)  
<div style="text-align:center;color:grey;">http 1.1 302说明</div>   

但是实际上，所有的浏览器都会默认把POST请求直接改为GET请求。 

2️⃣ 对于`301`状态码，搜索引擎在抓取新内容的同时，也将旧网址替换为重定向后的网址。而对于`302`状态码则会保留旧的网页内容。    

3️⃣ 兼容性：服务端考虑准备使用`303`的时候，一般还是会使用`302`代替，因为要兼容许多不支持`http 1.1`的浏览器，而对与要进行`307`返回的时候，浏览器一般会将要重定向的URL放到Response.body中，让用户去进行下一步操作。       

4️⃣ `303`和`307`的存在，就是细化了http 1.0中`302`的行为，归根结底是由于POST方法的非幂等属性引起的。
![](/blog_assets/303_REPOST.png)  
<div style="text-align:center;color:grey;">http 1.1 303说明</div> 

![](/blog_assets/307_REPOST.png)  
<div style="text-align:center;color:grey;">http 1.1 307说明</div>

#### 304 Not Modified（差点漏了你）
1️⃣ 表示本次请求命中了缓存策略,客户端应该直接从本地的缓存中取出内容。    
2️⃣ 304状态码返回时，不包含任何响应的主题部分       

![](/blog_assets/304.png)  


___
### 4XX

#### 400 BAD REQUEST
* 表示该请求报文中`存在语法错误`，导致服务器无法理解该请求。客户端需要修改请求的内容后再次发送请求。

#### 401 UNAUTHORIZED
* 该状态码表示发送的请求需要有通过HTTP认证
* 当客户端再次请求该资源的时候，需要在请求头中的Authorization包含认证信息。

#### 403 FORBIDDEN
* 该状态码表明对请求资源的访问被服务器拒绝了。 
* 服务器没有必要给出拒绝的详细理由，但如果想做说明的话，可以在实体的主体部分原因进行描述 。
* 未获得文件系统的访问权限，访问权限出现某些问题，从未授权的发送源IP地址试图访问等情况都可能发生403响应。

#### 404 NOT FOUND
* 表明无法找到制定的资源
* 通常也被服务端用户表示不想透露的请求失败原因

### 5XX
#### 500 INTERNAL SERVER ERROR
* 表示服务器端在处理客户端请求的时候，服务器内部发生了错误

#### 503 SERVICE UNAVALIABEL
* 该状态码表示服务器已经处于一个超负荷的一个状态，或者是所提供的服务暂时不能够正常使用
* 若服务器端能够事先得知服务恢复时间的话，可以在返回503状态码的同时，把恢复时间写入`Retry-After`字段中



___
### 参考文章   
[100 continue 的秘密](https://blog.csdn.net/pzqingchong/article/details/70196092)
[http状态码 -百度百科](https://baike.baidu.com/item/HTTP%E7%8A%B6%E6%80%81%E7%A0%81/5053660?fr=aladdin)  
[301与302](https://lz5z.com/HTTP-301-vs-302/)  

[websocket探秘](https://segmentfault.com/a/1190000015985491)

[200/204/206-302/303/307 -cnblog](http://www.cnblogs.com/zhjh256/p/6910534.html)