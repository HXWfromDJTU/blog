## 前言
相比较于其他浏览器本地存储，cookie的特点在于符合匹配规则，则自动携带。服务端与客户端双方都可以写入。Cookie 的存在使得基于无状态的HTTP协议下，储存信息成为了可能。      

## cookie    
首先定义一下，cookie是一段记录用户信息的字符串，一般保存在客户端的内存或者硬盘中。
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/cookie_file.png)
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/ff_cookie.png)   

### 服务端对cookie进行写入
cookie的创建是由服务端的响应头，其中带着`set-cookie`的字段，来对客户端进行cookie设置。   
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/cookie_set.png)    

## 基础属性
| 属性名 | 作用 | 
| --- | --- |
| Name | 表示`cookie`的名称 |
| Value | 字段表示`cookie`的值 |
| size | 表示cookie的大小 |

## 作用域限制
| 属性名 | 作用 | 
| --- | --- |
| domain | 表示`cookie`有效的域，默认值为当前域名 |
| path | 字段表示`cookie`有效的路径，默认值为`/`表示全匹配。 |

##### 读取向上匹配
若不显示设置`cookie`的`domain`值，则浏览器会处理为生成一个只对当前域名有效的`cookie`。比如在`map.baidu.com`下，我们生成了一个cookie，但没有指定domain值，那么这个cookie,只有在访问`map.baidu.com`时候有效，而`abc.map.baidu.com`和`user.map.baidu.com`都是拿不到的。

##### Path 匹配
* `domain`为`www.abc.com`,`path`为`/sale/img`，则只有匹配`www.abc.com/sale/img`路径的资源才可以读取`cookie`。
* path 的规则是`模式匹配`，也就是向后匹配，上面的例子也能匹配`www.abc.com/sale/img/qqq/ss`

## 安全与时效
| 属性名 | 作用 | 
| --- | --- |
| Expire / Max-Age | 表示为cookie的有效时间，默认值session,也就是指浏览器session，也就是用户关闭浏览器就会清除掉这个cookie。 |
| Secure | 表示该cookie在安全的协议下才会生效 |
| HttpOnly | 只用于http请求，本地脚本不能够读写 |
| SameSite | 标明该cookie是否在跨站点请求时发送 | 

### 有效时间
* Expire 的值为一个日期时间，则表示在此时间前，cookie始终有效。    
* Max-Age 的值为一个秒值

### 协议安全
* 若设置为true，则表表示此`cookie`只会在https协议或者ssl等安全协议下进行发送。
* 网页中通过 js 去设置Secure类型的 cookie，必须保证网页是https协议的。在http协议的网页中是无法设置secure类型cookie的。
  ```js
  document.cookie = "username=cfangxu; secure"
  ```

### HttpOnly
* 表示该`cookie`只会在`http`请求传输的时候携带
* 不能够被本地的JavaScript脚本所读取到。(可以简要的防止XSS攻击)。      

### SameSite    
SameSite 用于限制第三方cookie的使用, 在 a.com 下发起对 b.com 的请求，cookie携带与否，将取决于`SameSite`这个属性。
##### SameSite 取值
* `Strict` 表示绝对禁止所有的跨站`cookie`
* `None` 则表示不启用该规则
* 默认为`Lax`, 限制强度介于 `Strict` 和 `None` 之间, 相对于`Strict`仅允许以下三种情况的`cookie`携带
    * `<a href="..."></a>` 连接跳转
    * `<link rel="prerender" href="..."/>` 预加载
    * `<form method="GET" action="...">` GET形式的表单   

##### same site 与 same origin
* 大多数人应该知道 同源策略 中的 `same origin`，但 `same site`中的 `site`，指的则是有`eTLD + 1`，其中 eTLD 指的是 effective top-level domain(有效顶级域名)
* 大多数有效顶级域名和我们认知的顶级域名一致。  
* 少数有效顶级域名，与熟知的顶级域名不一致。比如一些二级域名`github.com` `.gov.uk` `.org.uk`也是有效顶级域名。参考[👉这份名单](https://publicsuffix.org/list/effective_tld_names.dat)       

##### 第三方cookie隐私问题    
* 你在闲逛某个`网站A`的时候，使用管理工具查看`cookie`，发现除了本域下的`cookie`,还经常存在`某些知名`搜索网站的`cookie`。  
  ![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/third_party_cookie.png)   

* 这并不是什么秘密了，而是搜索网站跟踪手机用户习惯的`主要手段`。    
* 比如你的网站加入了`某某广告联盟`，则在你的网站中加入`上报脚本`，告知`广告联盟`这个用户来过这里，帮助联盟构建更完整的用户画像。   

##### SameSite 小结
* 因为欧美国家对用户隐私的关注，来到2020年秋天的这个时间，已经被大多数主流浏览器所支持。      
* 对网站开发中，使用`CORS`调用部署在其他站点的第三方`API`存在影响

### CORS 请求中的 cookie
关于域的设置，👆前面讲解domain部分有介绍。

`cookie`中的`domin`设置的跨域是指跨子域名都不可以访问,例如`www.baidu.com`和`map.baidu.com`是不可以跨域进行读取内容的。(看上述domain第一条规则)
![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/cookie_devtool.png)
##### CORS下的cookie跨域
* 首先服务端要返回`Access-Control-Allow-Credentials`表明允许跨域请求携带`cookie`，并且`Allow-Control-Allow-Origin`字段也不能模糊的表示为`*`，而要写明`cookie`发送的域

* 再者，客户端也要设置请求的携带`cookie`
```js
// 原生ajax请求设置跨域携带cookie
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```   

## 客户端读写Cookie
##### 读取 cookie
读取cookie可以使用`docuemnt.cookie`

![](https://raw.githubusercontent.com/HXWfromDJTU/blog/master/blog_assets/js_cookie.png)

```js
document.cookie = 'userId=xusfh123; maxAge=5000；path=/;secure'
```
##### 如何写入
* 写入cookie也是用的是这个属性，但要注意，但是不支持同时设置多个cookie，需要分开多次调用设置属性值。

* 删除一个cookie的方法就是把对应字段的`cookie`值置空。  

##### 实现单点登录 cookie ✅
当服务器想共享`cookie`值给所有二级域名的时候，我们的`cookie`就应该设置为`共同的上一级域名`。比如`.baidu.com`(常用于单点登录)。建议设置cookie时候，都带上`.`通配符号，如`.a.b.c.baidu.com`。


##### 允许向上写入 ✅
一个服务器能够设置`domian`的有效的范围是，从自身域名开始，`向上`追溯到一级域名。比如`a.b.c.baidu.com`能够设置有效的cookie-domain是`.a.b.c.baidu.com`、`.b.c.baidu.com`、`.c.baidu.com`、`.baidu.com`。

##### 不允许跨子域写入 ❌
不能够跨`上级域名`设置其他域的子域。不能够设置`.a.u.c.baidu.com`。例如如下： 
1. 前端服务部署在 dashboard.swain.com, 服务端api部署在 api.swain.com上
2. 前端请求后端，后端返回头中，携带的`set-cookie`中，`domain`字段为 `.dashboard.swain.com`
3. 浏览器控制台得到一个`"this. set-cookie domain attribute was invalid with regards to the current host URL".`的错误

这就是一个跨子域设置cookie的实例，正确的方式应该设置`domain`为`.swain.com`

##### 同域同名覆盖 ⚠️
在不domain下的cookie即使同名也不会覆盖，若在同一个domain下，同名的cookie后者会覆盖前者。  


##### 低安全级别无法覆盖高安全级别   
`secure`与`http-only`都象征着更高的对应`cookie`条目的更高安全级别，当前`cookie`已经添加了对应安全策略的时候，更低安全策略的`cookie`写入相对于是无法无盖已存在的旧`cookie`值。   

### 大小数目有限制
因为cookie会跟随请求自动发送的特性，所以浏览器对对一个域的`cookie总大小`和数目都有着不同的限制。
| 浏览器 | 数目(个/域) | 每域下的cookie总大小限制 | 其他 |
| ------ | ------ | ------ | ------ |
| Firefox | 50个  | 4k | |
| Chrome | 53个  | 4k ||
| Safari | 无限制  | 4k |  |
| IE 7+ | 50个  | <4k |  超长则截断，超过数目则使用LRU淘汰 |
| IE 6 | 20个  | <4k |   超长则截断，超过数目则使用LRU淘汰 |
| Opera | 30个  | 4k ||

## 总结
1. 不建议`cookie`当做我们的本地数据仓库使用，而仅仅去存储一些用户的`id`,`sessionID`之类的身份验证性的简单数据。    
2. 设置 `cookie` 需要注意对应的`有效范围`、`有效期`、`安全生效条件`等属性   
3. 特别注意最近各个浏览器对于`SameSite`的支持情况，有可能对于你的应用导致致命的bug。     

接下来会结合`安全`、`隐私`方向，说说最常见的用`cookie`作为用户身份标识，遇到的问题和解决方案。 

## 参考文章
[1] [从url中解析出域名、子域名和有效顶级域名 - alsotang](https://zhuanlan.zhihu.com/p/22714186)    
[2] [干掉状态：从 session 到 token](https://juejin.im/entry/592e286d44d9040064592a7b)
[3] [正确使用cookie中的domain](https://blog.csdn.net/u010856177/article/details/81104714)


