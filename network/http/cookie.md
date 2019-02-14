# cookie  
### cookie是什么  
首先定义一下，cookie是一段记录用户信息的字符串，一般保存在客户端的内存或者硬盘中。       

![](/blog_assets/ff_cookie.png)
### 服务端读写cookie
cookie的创建是由服务端的响应头，其中带着`set-cookie`的字段，来对客户端进行cookie设置。   

![](/blog_assets/cookie_set.png) 

##### 常用字段有  
`name` 表示cookie的名称    

`value` 字段表示cookie的值       

`domain` 表示cookie的有效域，默认值为当前域名。         
👉 当服务器是`非顶级域名`时，不能够跨顶级域名设置其他域的二级三级域名。     
👉 当服务器是`顶级域名`时，只能够设置顶级域名，不能够设置二级与三级域名,也不能够读取二级与三级域名中的`cookie`     
👉 当服务器是`二级域名`时，只能够设置domain为自身`二级域名`或者`对应的顶级域名`，那么当我们想共享cookie值给所有二级域名的时候，我们的cookie就应该设置为`对应的顶级域名`。         

`path` 也表示限制cookie的有效范围，与`domain`共同作用,默认值为`/`表示所有路径       
比如说`domain`为`www.abc.com`,`path`为`/sale/img`，则只有匹配`www.abc.com/sale/img`路径的资源才可以读取`cookie`。  
谨记，这里的规则是`匹配模式`的，也就是说，上面的例子也能匹配`www.abc.com/sale/img/qqq/ss`      

`expire/Max-Age`表示为cookie的有效时间       
默认值session,也就是指浏览器session，也就是用户关闭浏览器就会清除掉这个cookie。       
若明确设置时间，则表示在此时间前，cookie始终有效。    
expire 的值为一个日期时间     
Max-Age 的值为一个秒值   

`size` 表示cookie的大小     

`secure` 若设置为true，则表表示此`cookie`只会在https协议或者ssl等安全协议下进行发送。          

`http-only` 表示该cookie只会在http请求传输的时候携带，而不能够被本地的JavaScript脚本所读取到。(可以简要的防止XSS攻击)。     

### 客户端读写Cookie 
读取cookie可以使用`docuemnt.cookie`
![](/blog_assets/js_cookie.png)  
写入cookie也是用的是这个属性，但要注意，但是不支持同时设置多个cookie，需要分开多次调用设置属性值。       
```js
document.cookie = 'userId=xusfh123; maxAge=5000；path=/;secure'
``` 
##### 格式化cookie
```js
// 格式化cookie函数
function getCookieJson() { 
    var cookie = document.cookie;
    var pattern = /([^=]+)=([^;]+);?\s*/g;
    var result, value = {}; 
    while((result = pattern.exec(cookie)) != null) {
         value[result[1]] = result[2]; 
         } return value; 
   }
```
![](/blog_assets/parse_cookie.png)
##### 删除cookie 
无论是服务端还是客户端，删除一个cookie的方法就是把对应字段的`cookie`值置空。
```js 
function setCookie(name,value){
    var cookies = getCookieJson(); // 获取Json 格式的 cookie
    cookies[name] = value; // 设置cookie
    var result =[];
    for(var key in cookies){
        if(cookies[key]!==''){ // 过滤掉被置空的cookie
          result.push(key +'=' + cookies[key]); // 收集有效cookie
        }  
    }
    var newCookie = result.join('; ');  //分号分割 
    document.cookie = newCookie;  // 设置新cookie
    return newCookie;
}
```

### 大小数目有限制  
浏览器对对一个域的cookie大小和数目都有着不同的限制。   
| 浏览器 | 数目(个/域) | 总大小 | 其他 |
| ------ | ------ | ------ | ------ | 
| Firefox | 50个  | 4M | 
| Chrome | 53个  | 4M |
| Safari | 无限制  | 4M |  
| IE 7+ | 50个  | <4m |  使用LRU淘汰 |
| IE 6 | 20个  | <4m |  使用LRU淘汰 |
| Opera | 30个  | 4M |

### 不可跨域使用  
关于域的设置，👆前面部分有介绍。     

`cookie`中的`domin`设置的跨域是指跨子域名都不可以访问,例如`www.baidu.com`和`map.baidu.com`是不可以跨域进行读取内容的。     
![](/blog_assets/cookie_devtool.png) 
##### 在设置CORS请求的时候     
✅ 首先服务端要返回`Access-Control-Allow-Credentials`表明允许跨域请求携带`cookie`，并且`Allow-Control-Allow-Origin`字段也不能模糊的表示为`*`，而要写明`cookie`发送的域      
✅ 再者，客户端也要设置请求的携带`cookie`     
```js
// 原生ajax请求设置跨域携带cookie
var xhr = new XMLHttpRequest(); 
xhr.withCredentials = true;
```
  

### cookie其他知识
1️⃣  由于 cookie会在每一次请求中都携带数据发送到服务端，当cookie数据量比较大的时候，会浪费带宽。所以，不建议`cookie`当做我们的本地数据仓库使用，而仅仅去存储一些用户的`id`,`sessionID`之类的身份验证性的简单数据。       

___
### cookie和session体系 


我们知道`session`是一个临时的进程组群，目的是去完成一些任务。每当OS接收到新任务的时候，就会调度进程去执行任务，一个进程忙不过来就会继续调用其他进程或者创建紫禁城一起去执行，出现的这些进程会被分为一个个的进程组，最后这些共同完成任务的进程组一起可以被理解为一个`session`会话。        

##### session+cookie工作过程
1️⃣ 当客户端首次向服务端请求的时候，服务端维护一个session，生成一个sessionid，值可以随意约定，就是一个用于标记session的值。   

2️⃣ server通过http返回给客户端，客户端接收到了并保存在cookie中。     

3️⃣ 客户端结束掉了请求连接，服务端就会释放掉这些进程对资源的占用，本次会话的`状态`会被暂时保存在一个文件中，在一定的时间内，服务端会保留这个文件。       

4️⃣ 在超时时间范围内，客户端每次访问该域名都会用`cookie`携带`sessionid`到服务端，服务端再根据`sessionid`找回保存着记录状态的文件，再次为客户打开一个新的对话，并且根据这个状态中记录的内容，打开对应的资源。   

对于客户端来看，客户端后来每次去访问的时候都可以直接跳过了身份验证等重复操作，造成了好像服务器是一直在等待客户端的假象，其实服务器在连接断开的时候就释放掉了对应的进程资源。       

##### 优化改进(token)
`问题一`     
session状态文件，在服务端是会占用服务端的资源和内存，所以服务端需要维护session的数目，以防内存的溢出。但是用户数目众多的时候，服务还是会因为要维护`session`而不堪重负。     
`问题二`     
若使用分布式系统，那么跨服务器需要维护一个同一个session，则需要使用一个单独的session服务器去维持访问。一旦session崩溃，那么所有的用户状态都会丢失。       

基于以上问题，我们可以使用`时间换空间`的思维，服务端不再保存session信息，而是将这部分信息进行编码后再加密，通过`cookie`返回给客户端，我们称之为`token`。下次用户再进行登录的时候，都携带`token`进行访问，服务端使用秘钥进行解密，若能够解开并且解编码成功，则说明这个`token`是之前服务器下发的，也就证明了这个客户端用户的合法性。

___
### 参考文章   


[干掉状态：从 session 到 token](https://juejin.im/entry/592e286d44d9040064592a7b)

