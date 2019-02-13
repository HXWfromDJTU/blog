# cookie  
### 服务端读写cookie
cookie的创建是由服务端的响应头，其中带着`set-cookie`的字段，来对客户端进行cookie设置。   

![](/blog_assets/cookie_set.png) 

##### 常用字段有  
`name` 表示cookie的名称    

`value` 字段表示cookie的值       

`domain` 表示cookie的有效域。         
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
1️⃣  由于 cookie会在每一次请求中都携带数据发送到服务端，当cookie数据量比较大的时候，会浪费带宽。所以，不要讲cookie当做我们的本地数据仓库使用，而建议仅仅去存储一些用户的`id`之类的身份验证性的简单数据。       


### cookie和session体系 
服务端维护一个session，产生一个sessionID，通过http返回给客户端并保存在cookie中，然后在超时时间范围内，每次访问该域名都会携带sessionID到服务端，服务端再根据sessionID找回session。   

session在服务端是会占用服务端的资源和内存，所以服务端需要维护session的数目，以防内存的溢出。   

若出现分布式下需要维护一个同一个session，则需要使用一个单独的session服务器去维持访问。   


___
### 参考文章   




